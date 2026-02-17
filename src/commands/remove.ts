import { getConfig, saveConfig } from '../lib/config.js';
import chalk from 'chalk';

export async function removeAccount(alias: string) {
    if (!alias) {
        console.error(chalk.red('Alias is required.'));
        return;
    }

    const config = await getConfig();
    const index = config.Accounts.findIndex(a => a.Alias === alias);

    if (index !== -1) {
        config.Accounts.splice(index, 1);

        if (config.ActiveProfile === alias) {
            config.ActiveProfile = null;
            console.log(chalk.yellow(`Active profile '${alias}' was removed. No active profile selected.`));
        }

        await saveConfig(config);
        console.log(chalk.green(`Account '${alias}' removed successfully.`));
    } else {
        console.error(chalk.red(`Account '${alias}' not found.`));
    }
}
