const crypto = require('crypto');

// HARDCODED SECRET KEY (32 bytes) - MUST MATCH KEYGEN
// In production, this should be obfuscated or loaded securely.
// For this fix, we use a consistent key to ensure pairing works.
const SECRET_KEY = Buffer.from('12345678901234567890123456789012', 'utf8'); // 32 chars
const IV_LENGTH = 16; // For AES, this is always 16

function verifySignature(payload, signature) {
    // In this new system, "verification" is just "successful decryption".
    // We try to decrypt the 'signature' (which is actually the encrypted payload).
    // If it matches the 'payload' (machineId), it's valid.

    try {
        if (!signature || !payload) return false;

        // Signature format: IV:EncryptedData (hex)
        const parts = signature.split(':');
        if (parts.length !== 2) return false;

        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = Buffer.from(parts[1], 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        const decryptedString = decrypted.toString();

        // The decrypted data should be the Machine ID (or a JSON containing it)
        // For simplicity, we just compare strings.
        // Normalize both to ensure no whitespace issues.
        const normalizedPayload = String(payload).trim();
        const normalizedDecrypted = String(decryptedString).trim();

        return normalizedPayload === normalizedDecrypted;

    } catch (e) {
        console.error("License Decryption Failed:", e.message);
        return false;
    }
}

// Helper to encrypt (Useful for Keygen, included here for consistency)
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

module.exports = {
    verifySignature,
    encryptLicense // Exported so Keygen can use the same file/logic
};
