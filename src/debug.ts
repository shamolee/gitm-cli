import { getConfig } from './lib/config.js';

console.log('Starting debug...');
try {
    getConfig().then(config => {
        console.log('Config loaded:', config);
    }).catch(err => {
        console.error('Config error:', err);
    });
} catch (e) {
    console.error('Runtime error:', e);
}
