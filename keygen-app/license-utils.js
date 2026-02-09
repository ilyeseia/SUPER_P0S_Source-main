const crypto = require('crypto');

function normalizeId(id) {
    // Exact same logic as Main App
    return crypto.createHash('sha256').update(String(id).trim().toLowerCase()).digest('hex').substring(0, 16).toUpperCase();
}

module.exports = { normalizeId };
