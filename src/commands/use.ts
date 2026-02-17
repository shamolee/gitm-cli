import { getConfig, saveConfig } from '../lib/config.js';
import chalk from 'chalk';

export async function useAccount(alias: string) {
    const config = await getConfig();
    const exists = config.Accounts.some(a => a.Alias === alias);

    if (exists) {
        config.ActiveProfile = alias;
        await saveConfig(config);
        console.log(chalk.green(`Switched to account: ${alias}`));
    } else {
        console.error(chalk.red(`Account '${alias}' not found.`));
    }
}
