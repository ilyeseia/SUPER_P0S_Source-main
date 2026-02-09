const crypto = require('crypto');
const licenseCrypto = require('../src/license-crypto');

// 1. Setup Keys (MATCHING PROD)
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBTokvWZapS9Xq
5Th+r8e2b0Veqpgq6IwHHDgd4fAbxfzog595mr33Y0XUvaGhgN6xDtJrqUygHXs0
hF5gohPW+/FS2AjByTJHTEavPuN6Q+XyF+lAHMNgwPce7mQm/rjVukh31+nYSnGh
ug/VOLNZXCNjv4R3cc9lEY7OioWdNil7Hs5w4AcuOccER7A8qC1Mu1n0jU/+P9fC
6YKO1dbBCeThcH9gxkWGD2aCs9zHmxAwqPuIEfzAEoSzWI9XNtvoH3Rmq8/MrtMi
lVr8mARoQ4viEvS0TU3xGn95sQi4kqWdJjwtyOUrzdFXxExYjreaKMfbSue4P3uw
A/1oTCcVAgMBAAECggEAG3Llc/3KsPt9wr8NyJ95QmSGeyzKMr2WtKPDLCsbBzaT
9QhLqt7YPrqv/cd3nhFIjefG5VbC9LF6/zgUlrAtFQftepAGnk3Nf+ZK2zOY5ZGi
oz/V9S6gZ6q+7Ht5aTgeUusCw1G7eOUJQafD+8jzXqsAs3dMfhGBG57kolt1IZ+B
q5qYqP0fDMnqghkrPql1txSABB0ucEFFlNqy7paILJ6yblq/+tmAuX39LPds2HG/
Bx3qRfg6bRVDGRfozJieIEHXQzIRMCQMQswWWvx/nyZDPIpOaq2czZSV5+boxieV
+piR8PN4j9+dnxNt3YAwmv29pjlmusvrj6SClvfXuQKBgQD5GE39kTFbOei7a052
qduPjZrxPtCzqr3rKHCFg1jrFT4dlbt4czfoN5/y4cfmHkkGTiQl87TOy5PXXM9/
UZ6QF3iFIDyMVQ5wQdrQpRQDvXLh3E+Cbz1uqa8j5556HMbqGsi+8a0NnSm/pZNG
qIE+C9Z2h/iEQ5Vmkb1ZqT5qUwKBgQDGqlUEfgfpBvDynm3htsMIW211n0+23Ep4
Zr9q75vDzmDnc9aGJCYBrHEjjP0UUeFSGZ8KLiBRhAvLQhiNnVnwym+ZeR/4vyvY
tCd/+AkTN9SBO10kHeNgbdbEeh37deDbFbBjDyzNERWV8OInt+syDgJp3VVxet0T
GDjS2zYL9wKBgGp84nKBTJlUU1M0F5IRIWToQ5HYqb31Q0WxvxDEyxGMvkZFiaR/
lSn4Ba/+p8ePsOY6J6f13Jj/XM+XxLkIOoIdFo/K7TeM8SQ6cwH5YGoM5nz6Ax+e
0KNrdQ0japOHk93m32UJylJkmsFsVl7BkKbmxqNbk3lvrwHvUgRvntgzAoGBAJkI
1Pzk6MsE4c7DY/mfg5WIeEVHN2yxPVyKKaICeYbYD6W7geFLL0vSvkSYcsuYV22a
9vwslBC3Gy6z953/PC1Ug6tBtvMysF/6RwM42iTHuRbj19fefizl767iMv5ly5R4
nKtyIRzGsE4UhOH7t12TlSBfs1X7QxlWa09iNbv5AoGAa6xJGxtlIF1NQcj2X8WY
WS58grJ/O3BrnyOcMBacdVtHyz95CKHrR9XnQ7DYR3owWMS0gmA/WMlgtWRScLax
XSCquwbimiIfglugWqd9f00FlG11hhP6w4vngxhjCC5j7CXqOEeyjIqq6jbFTvu6
whjc/ypFUSEdM2L/o1FPDXQ=
-----END PRIVATE KEY-----`;

// 2. Simulate Key Generation (Logic from keygen.html)
function simulateKeygen(deviceHash) {
    console.log("--- Simulating Key Generation ---");
    const payload = {
        customer_name: "Admin",
        device_hash: deviceHash,
        expiry_date: "2030-12-31",
        features: ["pos", "products", "customers", "reports", "settings", "users", "backup"],
        issue_date: new Date().toISOString().split('T')[0],
        license_type: "full",
        version_limit: "2.x"
    };

    // keygen.html: const payloadStr = JSON.stringify(payload);
    const payloadStr = JSON.stringify(payload);
    console.log("Payload String:", payloadStr);

    // keygen.html: Signature RSA-SHA256
    const sign = crypto.createSign('SHA256');
    sign.update(payloadStr);
    sign.end();
    const signatureBase64 = sign.sign(PRIVATE_KEY, 'base64');

    // keygen.html: const payloadBase64Safe = window.btoa(unescape(encodeURIComponent(payloadStr)));
    // Node.js equivalent for UTF-8safe base64
    const payloadBase64Safe = Buffer.from(payloadStr, 'utf8').toString('base64');

    const licenseKey = payloadBase64Safe + '.' + signatureBase64;
    console.log("Generated License Key:", licenseKey);
    return licenseKey;
}

// 3. Test Verification
function testVerification() {
    console.log("\n--- Testing Verification ---");
    const mockDeviceHash = "TEST-HASH-1234";
    const licenseKey = simulateKeygen(mockDeviceHash);

    const parsed = licenseCrypto.parseLicenseString(licenseKey);
    console.log("Parsed:", parsed ? "OK" : "FAILED");
    if (!parsed) process.exit(1);

    const isValidSig = licenseCrypto.verifySignature(parsed.payload, parsed.signature, parsed.rawPayload);
    console.log("Signature Validation Result:", isValidSig);

    console.log("\n--- Testing Validation (Device Hash Mismatch) ---");
    // We intentionally pass a DIFFERENT machine ID to see if the check is disabled
    const result = licenseCrypto.validateLicense(parsed, "DIFFERENT-HASH-9999");
    console.log("Validation Result:", result);

    if (result.active === true && isValidSig === true) {
        console.log("\nSUCCESS: License verified and Device Mismatch ignored.");
        process.exit(0);
    } else {
        console.error("\nFAILURE: Verification failed.");
        console.error("Reason:", result.reason);
        process.exit(1);
    }
}

testVerification();
