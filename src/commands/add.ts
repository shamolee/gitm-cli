import inquirer from 'inquirer';
import { getConfig, saveConfig } from '../lib/config.js';
import { Account } from '../lib/types.js';
import * as os from 'os';
import * as path from 'path';
import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import chalk from 'chalk';

type Answers = {
    alias: string;
    existingAlias?: boolean;
    name: string;
    email: string;
    authType: 'SSH' | 'PAT';
    sshKeyPath?: string;
    genSsh?: boolean;
    gitUsername?: string;
    token?: string;
};

export async function addAccount() {
    console.log(chalk.green('Adding new Git Account'));

    const config = await getConfig();

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'alias',
            message: 'Enter Alias (e.g. work, personal):',
            validate: (input) => {
                if (!input) return 'Alias is required';
                if (config.Accounts.some(a => a.Alias === input)) return 'Alias already exists';
                return true;
            }
        },
        {
            type: 'input',
            name: 'name',
            message: 'Enter Name (e.g. John Doe):'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Enter Email:'
        },
        {
            type: 'list',
            name: 'authType',
            message: 'Authentication Method?',
            choices: ['SSH', 'PAT'],
            default: 'SSH'
        }
    ]);

    let sshKeyPath = '';
    let gitUsername = '';
    let token = '';

    if (answers.authType === 'SSH') {
        const sshAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'sshKeyPath',
                message: 'Enter path to SSH Private Key (Leave empty to generate new):'
            }
        ]);

        sshKeyPath = sshAnswers.sshKeyPath;

        if (!sshKeyPath) {
            const genAnswers = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'genSsh',
                    message: 'Generate new SSH Key?',
                    default: true
                }
            ]);

            if (genAnswers.genSsh) {
                const keyFileName = `id_gitm_${answers.alias}`;
                const sshDir = path.join(os.homedir(), '.ssh');
                fs.ensureDirSync(sshDir);
                sshKeyPath = path.join(sshDir, keyFileName);

                console.log(chalk.yellow('Generating SSH Key...'));
                const result = spawnSync('ssh-keygen', ['-t', 'ed25519', '-C', answers.email, '-f', sshKeyPath, '-N', ''], { stdio: 'inherit' });

                if (result.status === 0) {
                    console.log(chalk.green(`SSH Key generated at: ${sshKeyPath}`));
                    console.log(chalk.magenta('!!! ACTION REQUIRED !!!'));
                    console.log('Please add the following Public Key to your GitHub/GitLab account:');
                    if (fs.existsSync(sshKeyPath + '.pub')) {
                        console.log(chalk.gray(fs.readFileSync(sshKeyPath + '.pub', 'utf-8')));
                    }
                } else {
                    console.error(chalk.red('Failed to generate SSH key.'));
                    return;
                }
            }
        }
    } else {
        const patAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'gitUsername',
                message: 'Enter Git Username (e.g. your-github-handle):'
            },
            {
                type: 'password', // Masked input
                name: 'token',
                message: 'Enter Personal Access Token (PAT):',
                mask: '*'
            }
        ]);
        gitUsername = patAnswers.gitUsername;
        token = patAnswers.token;
    }

    const newAccount: Account = {
        Alias: answers.alias,
        Name: answers.name,
        Email: answers.email,
        AuthType: answers.authType,
        SshKeyPath: sshKeyPath,
        GitUsername: gitUsername,
        Token: token
    };

    config.Accounts.push(newAccount);

    if (!config.ActiveProfile) {
        config.ActiveProfile = answers.alias;
    }

    await saveConfig(config);
    console.log(chalk.green(`Account '${answers.alias}' added successfully.`));
}
