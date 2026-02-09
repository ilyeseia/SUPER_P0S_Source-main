module.exports = {
    verifyIntegrity: () => ({ valid: true, tampered: [] }),
    enforceIntegrity: () => true,
    generateIntegrityFile: () => ({}),
    calculateFileHash: () => "",
    CRITICAL_FILES: []
};