import { getConfig } from '../lib/config.js';
import chalk from 'chalk';

export async function listAccounts() {
    const config = await getConfig();
    console.log(chalk.cyan('Registered Git Accounts:'));

    config.Accounts.forEach(acc => {
        const isActive = acc.Alias === config.ActiveProfile;
        const marker = isActive ? '*' : ' ';
        const color = isActive ? chalk.green : chalk.white;
        const type = acc.AuthType || 'SSH'; // Default to SSH for legacy

        console.log(color(`[${marker}] ${acc.Alias} - ${acc.Name} <${acc.Email}> [${type}]`));
    });
}
