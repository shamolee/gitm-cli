import fs from 'fs';
import path from 'path';
import os from 'os';

const configPath = path.join(os.homedir(), '.gitmconfig');
const cleanConfig = {
    "Accounts": [],
    "ActiveProfile": null,
    "Settings": {
        "Confirmation": false
    }
};

try {
    fs.writeFileSync(configPath, JSON.stringify(cleanConfig, null, 2));
    console.log('Fixed config file at:', configPath);
} catch (e) {
    console.error('Error fixing config:', e);
}
