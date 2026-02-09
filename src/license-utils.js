const os = require('os');
const crypto = require('crypto');

/**
 * Generates a stable device hash without external dependencies.
 * Used for license identification (now bypassed).
 */
function getDeviceHash() {
    try {
        // Use hostname and platform as a stable unique-ish identifier
        const baseId = os.hostname() + '-' + os.platform() + '-' + os.arch();
        return crypto.createHash('sha256').update(baseId.toLowerCase().trim()).digest('hex').substring(0, 16).toUpperCase();
    } catch (error) {
        return "UNKNOWN-DEVICE-" + os.hostname().toUpperCase();
    }
}

module.exports = { getDeviceHash };