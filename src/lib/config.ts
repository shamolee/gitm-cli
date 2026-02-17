import fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { Config, defaultConfig } from './types.js';

const configPath = path.join(os.homedir(), '.gitmconfig');

export async function getConfig(): Promise<Config> {
    if (!fs.existsSync(configPath)) {
        return { ...defaultConfig };
    }
    try {
        const raw = await fs.readJson(configPath);

        // Ensure Settings exist (migration)
        if (!raw.Settings) {
            raw.Settings = { Confirmation: false };
        }
        return raw as Config;
    } catch (err) {
        console.error('Error reading config:', err);
        return { ...defaultConfig };
    }
}

export async function saveConfig(config: Config): Promise<void> {
    try {
        await fs.writeJson(configPath, config, { spaces: 2 });
    } catch (err) {
        console.error('Error writing config:', err);
        throw err;
    }
}
