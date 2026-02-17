#!/usr/bin/env node
import { Command } from 'commander';
import { invokeGit } from './lib/git.js';
import { addAccount } from './commands/add.js';
import { removeAccount } from './commands/remove.js';
import { listAccounts } from './commands/list.js';
import { useAccount } from './commands/use.js';
import { settingsCommand } from './commands/settings.js';

const program = new Command();

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

program
    .name('gitm')
    .description('Git Manager - Manage multiple Git identities')
    .version(packageJson.version);

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
program
    .argument('[args...]', 'Git commands and arguments')
    .passThroughOptions()
    .allowUnknownOption()
    .action(async (args) => {
        if (!args || args.length === 0) {
            program.help();
            return;
        }
        await invokeGit(args);
    });

program.parse(process.argv);
