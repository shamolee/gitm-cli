import { getConfig, saveConfig } from '../lib/config.js';
import chalk from 'chalk';

export async function settingsCommand(command?: string, value?: string) {
    const config = await getConfig();

    if (command === 'confirmation') {
        if (value === 'on' || value === 'true') {
            config.Settings.Confirmation = true;
            console.log(chalk.green('Confirmation prompt enabled.'));
        } else if (value === 'off' || value === 'false') {
            config.Settings.Confirmation = false;
            console.log(chalk.yellow('Confirmation prompt disabled.'));
        } else {
            console.error(chalk.red('Usage: gitm settings confirmation [on|off]'));
            return;
        }
        await saveConfig(config);
    } else if (command === 'reset') {
        config.Settings.Confirmation = false;
        await saveConfig(config);
        console.log(chalk.green('Settings reset to default.'));
    } else {
        // List settings
        console.log(chalk.cyan('Current Settings:'));
        console.log(`  Confirmation: ${config.Settings.Confirmation}`);
    }
}
