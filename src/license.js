const { db } = require('./database');
const { getDeviceHash } = require('./license-utils');

// -- Configuration --
const APP_VERSION = "2.0.4"; // Unlocked Version

// -- License Check Logic (BYPASSED) --
function checkLicense() {
    console.log("License check bypassed. Returning PREMIUM status.");
    return {
        active: true,
        licenseType: "PREMIUM",
        device_hash: "UNLOCKED-VERSION",
        expiryDate: "2099-12-31" // Never expires
    };
}

// -- Activation Logic (BYPASSED) --
function activateLicense(licenseKey) {
    console.log("Activation call bypassed.");
    return { success: true, message: "تم التفعيل بنجاح (نسخة مفتوحة)" };
}

// -- Feature Check (BYPASSED) --
function hasFeature(featureName) {
    return true; // All features enabled
}

// -- Export --
module.exports = {
    checkLicense,
    activateLicense,
    hasFeature,
    getDeviceHash,
    APP_VERSION
};