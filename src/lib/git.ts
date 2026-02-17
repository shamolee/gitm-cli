import spawn from 'cross-spawn';
import { getConfig } from './config.js';
import { Config, Account } from './types.js';

export async function invokeGit(args: string[]): Promise<void> {
    const config = await getConfig();
    let activeProfile: Account | undefined;

    if (config.ActiveProfile) {
        activeProfile = config.Accounts.find(a => a.Alias === config.ActiveProfile);
    }

    // Confirmation Prompt
    if (config.Settings.Confirmation) {
        const profileName = activeProfile ? activeProfile.Alias : "Default (Global)";
        const profileEmail = activeProfile ? activeProfile.Email : "System Default";

        console.log(`\x1b[36m[gitm] Account: ${profileName} <${profileEmail}>\x1b[0m`);
        // Note: Implementing interactive confirmation in git wrapper might be tricky if it's piping.
        // Ideally, the CLI entry point handles this if it knows it's a git command.
        // But since `gitm <args>` falls through to this, we should do it here.
    }

    const env = { ...process.env };
    const extraArgs: string[] = [];

    if (activeProfile) {
        env['GIT_AUTHOR_NAME'] = activeProfile.Name;
        env['GIT_AUTHOR_EMAIL'] = activeProfile.Email;
        env['GIT_COMMITTER_NAME'] = activeProfile.Name;
        env['GIT_COMMITTER_EMAIL'] = activeProfile.Email;

        const authType = activeProfile.AuthType || 'SSH';

        if (authType === 'SSH' && activeProfile.SshKeyPath) {
            const keyPath = activeProfile.SshKeyPath.replace(/\\/g, '/');
            env['GIT_SSH_COMMAND'] = `ssh -i "${keyPath}" -o IdentitiesOnly=yes`;
        } else if (authType === 'PAT' && activeProfile.Token) {
            const gitUser = activeProfile.GitUsername || activeProfile.Name;
            const authString = `${gitUser}:${activeProfile.Token}`;
            const encoded = Buffer.from(authString).toString('base64');

            extraArgs.push('-c', `http.extraHeader=Authorization: Basic ${encoded}`);

            // Force HTTPS
            extraArgs.push('-c', `url."https://github.com/".insteadOf="git@github.com:"`);
            extraArgs.push('-c', `url."https://gitlab.com/".insteadOf="git@gitlab.com:"`);

            // Safe-guard SSH
            env['GIT_SSH_COMMAND'] = 'ssh -o IdentityFile=NUL -o IdentitiesOnly=yes -F NUL';
        }
    }

    const finalArgs = [...extraArgs, ...args];

    const child = spawn('git', finalArgs, { stdio: 'inherit', env });

    child.on('close', (code) => {
        process.exit(code || 0);
    });
}