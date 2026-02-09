const crypto = require('crypto');

// HARDCODED SECRET KEY (32 bytes) - MUST MATCH APP
const SECRET_KEY = Buffer.from('12345678901234567890123456789012', 'utf8'); // 32 chars
const IV_LENGTH = 16;

function encryptLicense(text) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (e) {
        console.error("Encryption Failed:", e);
        return null;
    }
}

module.exports = { encryptLicense };
