#!/usr/bin/env node
import { Command } from 'commander';
import { invokeGit } from './lib/git.js';
import { addAccount } from './commands/add.js';
import { removeAccount } from './commands/remove.js';
import { listAccounts } from './commands/list.js';
import { useAccount } from './commands/use.js';
import { settingsCommand } from './commands/settings.js';

const program = new Command();

program
    .name('gitm')
    .description('Git Manager - Manage multiple Git identities')
    .version('1.0.0');

program.command('acnt-add')
    .description('Register a new account')
    .action(addAccount);

program.command('acnt-rm')
    .description('Remove an account')
    .argument('<alias>', 'Alias of the account to remove')
    .action(removeAccount);

program.command('list')
    .description('List all accounts')
    .action(listAccounts);

program.command('use')
    .description('Switch active account')
    .argument('<alias>', 'Alias of the account to use')
    .action(useAccount);

program.command('settings')
    .description('Configure settings')
    .argument('[command]', 'confirmation | reset')
    .argument('[value]', 'on | off')
    .argument('[value]', 'on | off')
    .action(settingsCommand);

program.command('version')
    .description('Show version')
    .action(() => {
        // Read version from package.json
        // Since we are in dist/index.js, package.json is in ../package.json
        // But for ESM we can use fs/promises
        import('fs').then(async (fs) => {
            try {
                console.log(program.version());
            } catch (e) {
                console.error(e);
            }
        });
    });

// Catch-all for git commands
program.allowUnknownOption(true);

// If no command matches, treat as git command
// We need to parse manually if it fails matching known commands?
// commander's .on('command:*') is useful.

program.on('command:*', async (operands) => {
    // operands is array of args
    // We need to pass ALL args including flags to git.
    // If user ran `gitm commit -m "foo"`, operands might be ['commit'] and flags managed differently?
    // Actually, handling unknown commands/options correctly with commander can be tricky if we want to pass raw args.
    // A simpler approach for the wrapper is: check if first arg is a known command. If not, pass everything to invokeGit.
    const knownCommands = ['acnt-add', 'acnt-rm', 'list', 'use', 'settings', 'help', '--help', '-h', '--version', '-V'];
    /* 
       This listener only fires if unknown command.
       But we need strict separation.
    */
    invokeGit(program.args);
});

// We need to conditionally parse.
const args = process.argv.slice(2);
const known = ['acnt-add', 'acnt-rm', 'list', 'use', 'settings', 'help', '--help', '-h', '--version', '-V'];

if (args.length === 0 || known.includes(args[0])) {
    program.parse(process.argv);
} else {
    // It's a git command
    invokeGit(args);
}
