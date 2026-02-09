const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 1. Générer une paire de clés RSA
console.log("Génération de la paire de clés RSA 2048 bits...");
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});
console.log("Clés générées.");

// 2. Contenu de src/license-crypto.js
// Note: on utilise des backticks pour le template string de JS, donc on échappe ceux à l'intérieur
const licenseCryptoContent = `const crypto = require('crypto');

// CLE PUBLIQUE REGENEREE
const PUBLIC_KEY = \`${publicKey}\`;

function loadPublicKey() {
    return PUBLIC_KEY;
}

function parseLicenseString(licenseStr) {
    try {
        if (!licenseStr || !licenseStr.includes('.')) return null;
        const parts = licenseStr.split('.');
        if (parts.length !== 2) return null;

        const payloadBuf = Buffer.from(parts[0], 'base64');
        const signatureBuf = Buffer.from(parts[1], 'base64');
        
        const payloadStr = payloadBuf.toString('utf8');
        const payload = JSON.parse(payloadStr);

        return {
            payload: payload,
            signature: signatureBuf
        };
    } catch (e) {
        // console.error("Parse error:", e);
        return null;
    }
}

function verifySignature(payload, signatureBuffer) {
    try {
        const verify = crypto.createVerify('SHA256');
        // On re-stringifie le payload pour la vérification.
        // L'ordre des clés est important et doit correspondre à celui du keygen.
        const data = Buffer.from(JSON.stringify(payload));
        verify.update(data);
        verify.end();
        return verify.verify(PUBLIC_KEY, signatureBuffer);
    } catch (e) {
        console.error("Verify error:", e);
        return false;
    }
}

function validateLicense(parsedLicense, currentDeviceHash) {
    if (!parsedLicense) return { active: false, reason: 'INVALID_FORMAT' };
    
    const { payload, signature } = parsedLicense;

    if (!verifySignature(payload, signature)) {
        return { active: false, reason: 'INVALID_SIGNATURE' };
    }

    if (payload.expiry_date) {
        const expiry = new Date(payload.expiry_date);
        // Ajouter un jour pour inclure la date d'expiration complète
        expiry.setHours(23, 59, 59, 999);
        if (new Date() > expiry) {
            return { active: false, reason: 'EXPIRED' };
        }
    }

    if (payload.device_hash && currentDeviceHash) {
        if (payload.device_hash !== currentDeviceHash) {
            return { active: false, reason: 'DEVICE_MISMATCH' };
        }
    }

    return {
        active: true,
        payload: payload,
        reason: 'ACTIVE'
    };
}

function hasFeature(licenseData, feature) {
    if (!licenseData) return false;
    if (licenseData.license_type === 'full' || licenseData.license_type === 'unlimited') return true;
    if (licenseData.features && Array.isArray(licenseData.features)) {
        return licenseData.features.includes(feature);
    }
    return false;
}

function isVersionAllowed(licenseData, currentVersion) {
    if (!licenseData) return false;
    if (!licenseData.version_limit) return true;
    
    const limit = licenseData.version_limit.replace('x', '');
    return currentVersion.toString().startsWith(limit);
}

module.exports = {
    verifySignature,
    parseLicenseString,
    validateLicense,
    hasFeature,
    isVersionAllowed,
    loadPublicKey
};
`;

// 3. Contenu de keygen.html
// On échappe les backticks dans le code HTML/JS pour éviter de casser la string JS principale
const keygenHtmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Générateur de Licence ULTRA_POS</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; background: #f5f5f7; color: #333; }
        .container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { margin-top: 0; color: #0066cc; font-size: 24px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; }
        input[type="text"], input[type="date"] { width: 100%; padding: 10px; border: 1px solid #d1d1d6; border-radius: 6px; font-size: 16px; box-sizing: border-box; }
        button { background: #007aff; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
        button:hover { background: #0062cc; }
        .result-area { margin-top: 25px; background: #f2f2f7; padding: 15px; border-radius: 8px; display: none; }
        textarea { width: 100%; height: 100px; padding: 10px; border: 1px solid #d1d1d6; border-radius: 6px; font-family: monospace; font-size: 13px; resize: none; margin-bottom: 10px; box-sizing: border-box; }
        .copy-btn { background: #34c759; margin-top: 0; }
        .copy-btn:hover { background: #28a745; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.9.0/jsrsasign-all-min.js"></script>
</head>
<body>
    <div class="container">
        <h1>Générateur de Licence</h1>
        
        <div class="form-group">
            <label>Device Hash (Code Machine)</label>
            <input type="text" id="deviceHash" placeholder="Ex: E0D6BC1742BD5ACC..." autocomplete="off">
        </div>
        
        <div class="form-group">
            <label>Date d'Expiration</label>
            <input type="date" id="expiryDate" value="2030-12-31">
        </div>

        <button onclick="generate()">Générer la Clé</button>

        <div id="result" class="result-area">
            <label>Clé d'Activation:</label>
            <textarea id="licenseOutput" readonly></textarea>
            <button class="copy-btn" onclick="copy()">Copier la clé</button>
        </div>
    </div>

    <script>
        // CLE PRIVEE RSA GENEREE
        const PRIVATE_KEY = \`${privateKey.replace(/\n/g, '\\n')}\`;

        function generate() {
            const deviceHash = document.getElementById('deviceHash').value.trim();
            if (!deviceHash) {
                alert("Veuillez entrer le Device Hash");
                return;
            }

            const expiryDate = document.getElementById('expiryDate').value;
            
            // Payload (Ordre des clés important pour la cohérence avec le backend Node.js)
            const payload = {
                customer_name: "Admin",
                device_hash: deviceHash,
                expiry_date: expiryDate,
                features: ["pos", "products", "customers", "reports", "settings", "users", "backup"],
                issue_date: new Date().toISOString().split('T')[0],
                license_type: "full",
                version_limit: "2.x"
            };

            const payloadStr = JSON.stringify(payload);
            
            // Signature RSA-SHA256
            const sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
            sig.init(PRIVATE_KEY);
            sig.updateString(payloadStr);
            const signatureHex = sig.sign();
            
            // Encodage en Base64
            const signatureBase64 = hextob64(signatureHex);
            const payloadBase64 = btoa(payloadStr); // btoa est standard dans les navigateurs (Latin1 -> Base64)
            // Pour être sûr avec l'UTF-8 :
            // const payloadBase64 = KJUR.text.b64utob64(KJUR.text.utf8tob64u(payloadStr)); 
            // Mais btoa suffit souvent si pas de caractères spéciaux.
            // On va utiliser une fct safe pour utf8
            const payloadBase64Safe = window.btoa(unescape(encodeURIComponent(payloadStr)));

            const licenseKey = payloadBase64Safe + '.' + signatureBase64;
            
            document.getElementById('licenseOutput').value = licenseKey;
            document.getElementById('result').style.display = 'block';
        }

        function copy() {
            const copyText = document.getElementById("licenseOutput");
            copyText.select();
            document.execCommand("copy"); // Fallback compatibilité
            
            if (navigator.clipboard) {
                 navigator.clipboard.writeText(copyText.value);
            }
            alert("Clé copiée !");
        }
    </script>
</body>
</html>`;

// Écriture des fichiers
const srcPath = path.join(__dirname, '..', 'src', 'license-crypto.js');
const keygenPath = path.join(__dirname, '..', 'keygen.html');

console.log(`Ecriture de ${srcPath}...`);
fs.writeFileSync(srcPath, licenseCryptoContent);

console.log(`Ecriture de ${keygenPath}...`);
fs.writeFileSync(keygenPath, keygenHtmlContent);

console.log("TERMINE: Clés générées et fichiers créés.");

const setupScriptPath = path.join('C:\\Users\\seia\\Desktop\\SUPER_P0S_Source\\scripts', 'setup-keygen.js');
console.log("Script prêt.");

// Je dois m'assurer que le write_to_file se fait bien.
module.exports = { setupScriptPath };
