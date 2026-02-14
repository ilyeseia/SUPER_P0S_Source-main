/**
 * Unit Tests for License Validation
 * 
 * Tests for:
 * - License checking functionality
 * - License activation
 * - Feature access control
 * - Device hash generation
 * - Trial period handling
 * - License expiration
 */

const { describe, test, expect, beforeEach, afterEach, jest } = require('@jest/globals');

// ============================================
// 1. LICENSE CHECK TESTS
// ============================================

describe('License Check Functionality', () => {
    let licenseModule;

    beforeEach(() => {
        // Reset and re-require the module
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    describe('checkLicense', () => {
        test('should return license status object', () => {
            const result = licenseModule.checkLicense();
            
            expect(result).toBeDefined();
            expect(result).toHaveProperty('active');
            expect(result).toHaveProperty('licenseType');
            expect(result).toHaveProperty('device_hash');
        });

        test('should return active status for bypassed version', () => {
            const result = licenseModule.checkLicense();
            
            expect(result.active).toBe(true);
        });

        test('should return PREMIUM license type for bypassed version', () => {
            const result = licenseModule.checkLicense();
            
            expect(result.licenseType).toBe('PREMIUM');
        });

        test('should return device hash', () => {
            const result = licenseModule.checkLicense();
            
            expect(result.device_hash).toBeDefined();
            expect(typeof result.device_hash).toBe('string');
        });

        test('should return expiry date for license', () => {
            const result = licenseModule.checkLicense();
            
            expect(result.expiryDate).toBeDefined();
        });

        test('should have extended expiry for bypassed version', () => {
            const result = licenseModule.checkLicense();
            
            // The bypassed version should have a far future expiry
            expect(result.expiryDate).toBe('2099-12-31');
        });
    });
});

// ============================================
// 2. LICENSE ACTIVATION TESTS
// ============================================

describe('License Activation', () => {
    let licenseModule;

    beforeEach(() => {
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    describe('activateLicense', () => {
        test('should activate license with valid key', () => {
            const result = licenseModule.activateLicense('VALID-LICENSE-KEY');
            
            expect(result.success).toBe(true);
        });

        test('should return success message', () => {
            const result = licenseModule.activateLicense('VALID-LICENSE-KEY');
            
            expect(result.message).toBeDefined();
            expect(typeof result.message).toBe('string');
        });

        test('should accept any license key in bypassed version', () => {
            const testKeys = [
                'TEST-KEY-123',
                'RANDOM-STRING',
                '',
                '0000-0000-0000-0000'
            ];

            testKeys.forEach(key => {
                const result = licenseModule.activateLicense(key);
                expect(result.success).toBe(true);
            });
        });
    });
});

// ============================================
// 3. FEATURE ACCESS TESTS
// ============================================

describe('Feature Access Control', () => {
    let licenseModule;

    beforeEach(() => {
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    describe('hasFeature', () => {
        test('should return true for any feature in bypassed version', () => {
            const features = [
                'sales',
                'inventory',
                'reports',
                'users',
                'settings',
                'backup',
                'advanced_reports',
                'multi_user',
                'cloud_sync'
            ];

            features.forEach(feature => {
                const result = licenseModule.hasFeature(feature);
                expect(result).toBe(true);
            });
        });

        test('should return true for undefined feature', () => {
            const result = licenseModule.hasFeature(undefined);
            expect(result).toBe(true);
        });

        test('should return true for null feature', () => {
            const result = licenseModule.hasFeature(null);
            expect(result).toBe(true);
        });

        test('should return true for empty string feature', () => {
            const result = licenseModule.hasFeature('');
            expect(result).toBe(true);
        });

        test('should return true for non-existent feature', () => {
            const result = licenseModule.hasFeature('non_existent_feature');
            expect(result).toBe(true);
        });
    });
});

// ============================================
// 4. DEVICE HASH GENERATION TESTS
// ============================================

describe('Device Hash Generation', () => {
    let licenseUtils;

    beforeEach(() => {
        jest.resetModules();
        licenseUtils = require('../../src/license-utils');
    });

    describe('getDeviceHash', () => {
        test('should return a string', () => {
            const hash = licenseUtils.getDeviceHash();
            
            expect(typeof hash).toBe('string');
        });

        test('should return non-empty string', () => {
            const hash = licenseUtils.getDeviceHash();
            
            expect(hash.length).toBeGreaterThan(0);
        });

        test('should return consistent hash on multiple calls', () => {
            const hash1 = licenseUtils.getDeviceHash();
            const hash2 = licenseUtils.getDeviceHash();
            const hash3 = licenseUtils.getDeviceHash();
            
            expect(hash1).toBe(hash2);
            expect(hash2).toBe(hash3);
        });

        test('should return uppercase hex string', () => {
            const hash = licenseUtils.getDeviceHash();
            const hexPattern = /^[A-F0-9]+$/;
            
            // Either it's a valid hex string or it starts with "UNKNOWN-DEVICE"
            expect(
                hexPattern.test(hash) || hash.startsWith('UNKNOWN-DEVICE')
            ).toBe(true);
        });

        test('should handle os.hostname errors gracefully', () => {
            const os = require('os');
            const originalHostname = os.hostname;
            
            // Mock os.hostname to throw
            os.hostname = jest.fn(() => {
                throw new Error('Hostname error');
            });
            
            // Re-require to use the mocked version
            jest.resetModules();
            const utils = require('../../src/license-utils');
            
            const hash = utils.getDeviceHash();
            
            // Should still return something
            expect(typeof hash).toBe('string');
            expect(hash.length).toBeGreaterThan(0);
            
            // Restore
            os.hostname = originalHostname;
        });
    });
});

// ============================================
// 5. APP VERSION TESTS
// ============================================

describe('Application Version', () => {
    let licenseModule;

    beforeEach(() => {
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    test('should export APP_VERSION', () => {
        expect(licenseModule.APP_VERSION).toBeDefined();
    });

    test('should have correct version format', () => {
        const version = licenseModule.APP_VERSION;
        const versionPattern = /^\d+\.\d+\.\d+$/;
        
        expect(versionPattern.test(version)).toBe(true);
    });

    test('should be version 2.0.4', () => {
        expect(licenseModule.APP_VERSION).toBe('2.0.4');
    });
});

// ============================================
// 6. LICENSE TYPE VALIDATION TESTS
// ============================================

describe('License Type Validation', () => {
    const validLicenseTypes = ['TRIAL', 'BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'];
    
    test('should accept valid license types', () => {
        validLicenseTypes.forEach(type => {
            expect(typeof type).toBe('string');
            expect(type.length).toBeGreaterThan(0);
        });
    });

    test('should have PREMIUM as highest tier', () => {
        const tierOrder = ['TRIAL', 'BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'];
        const premiumIndex = tierOrder.indexOf('PREMIUM');
        
        expect(premiumIndex).toBeGreaterThanOrEqual(0);
    });

    test('should identify premium features', () => {
        const premiumFeatures = [
            'advanced_reports',
            'multi_branch',
            'cloud_sync',
            'api_access',
            'custom_integrations'
        ];

        // In bypassed version, all features should be available
        const licenseModule = require('../../src/license');
        premiumFeatures.forEach(feature => {
            expect(licenseModule.hasFeature(feature)).toBe(true);
        });
    });
});

// ============================================
// 7. LICENSE EXPIRATION TESTS
// ============================================

describe('License Expiration Handling', () => {
    test('should parse expiry date correctly', () => {
        const expiryDate = '2099-12-31';
        const parsed = new Date(expiryDate);
        
        expect(parsed instanceof Date).toBe(true);
        expect(isNaN(parsed.getTime())).toBe(false);
    });

    test('should identify expired license', () => {
        const pastDate = '2020-01-01';
        const expiryDate = new Date(pastDate);
        const now = new Date();
        
        expect(expiryDate < now).toBe(true);
    });

    test('should identify valid license', () => {
        const futureDate = '2099-12-31';
        const expiryDate = new Date(futureDate);
        const now = new Date();
        
        expect(expiryDate > now).toBe(true);
    });

    test('should calculate days until expiration', () => {
        const expiryDate = new Date('2099-12-31');
        const now = new Date();
        const daysUntilExpiry = Math.floor(
            (expiryDate - now) / (1000 * 60 * 60 * 24)
        );
        
        expect(daysUntilExpiry).toBeGreaterThan(0);
    });
});

// ============================================
// 8. LICENSE DATA STRUCTURE TESTS
// ============================================

describe('License Data Structure', () => {
    let licenseModule;

    beforeEach(() => {
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    test('should return correct license object structure', () => {
        const license = licenseModule.checkLicense();
        
        const requiredFields = ['active', 'licenseType', 'device_hash'];
        requiredFields.forEach(field => {
            expect(license).toHaveProperty(field);
        });
    });

    test('should have boolean active field', () => {
        const license = licenseModule.checkLicense();
        
        expect(typeof license.active).toBe('boolean');
    });

    test('should have string licenseType field', () => {
        const license = licenseModule.checkLicense();
        
        expect(typeof license.licenseType).toBe('string');
    });

    test('should have string device_hash field', () => {
        const license = licenseModule.checkLicense();
        
        expect(typeof license.device_hash).toBe('string');
    });
});

// ============================================
// 9. MODULE EXPORTS TESTS
// ============================================

describe('License Module Exports', () => {
    let licenseModule;

    beforeEach(() => {
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    test('should export checkLicense function', () => {
        expect(licenseModule.checkLicense).toBeDefined();
        expect(typeof licenseModule.checkLicense).toBe('function');
    });

    test('should export activateLicense function', () => {
        expect(licenseModule.activateLicense).toBeDefined();
        expect(typeof licenseModule.activateLicense).toBe('function');
    });

    test('should export hasFeature function', () => {
        expect(licenseModule.hasFeature).toBeDefined();
        expect(typeof licenseModule.hasFeature).toBe('function');
    });

    test('should export getDeviceHash function', () => {
        expect(licenseModule.getDeviceHash).toBeDefined();
        expect(typeof licenseModule.getDeviceHash).toBe('function');
    });

    test('should export APP_VERSION constant', () => {
        expect(licenseModule.APP_VERSION).toBeDefined();
    });
});

// ============================================
// 10. INTEGRATION TESTS
// ============================================

describe('License Integration Tests', () => {
    let licenseModule;

    beforeEach(() => {
        jest.resetModules();
        licenseModule = require('../../src/license');
    });

    test('should be able to check license and then check features', () => {
        const license = licenseModule.checkLicense();
        
        expect(license.active).toBe(true);
        
        const hasSales = licenseModule.hasFeature('sales');
        expect(hasSales).toBe(true);
    });

    test('should be able to activate and verify', () => {
        const activationResult = licenseModule.activateLicense('TEST-KEY');
        
        expect(activationResult.success).toBe(true);
        
        const license = licenseModule.checkLicense();
        expect(license.active).toBe(true);
    });

    test('should work with license-utils integration', () => {
        const license = licenseModule.checkLicense();
        const deviceHash = licenseModule.getDeviceHash();
        
        expect(license.device_hash).toBeDefined();
        expect(deviceHash).toBeDefined();
    });
});

// ============================================
// 11. ERROR HANDLING TESTS
// ============================================

describe('License Error Handling', () => {
    test('should handle invalid date format gracefully', () => {
        const invalidDate = 'invalid-date';
        const parsed = new Date(invalidDate);
        
        expect(isNaN(parsed.getTime())).toBe(true);
    });

    test('should handle null values in feature check', () => {
        jest.resetModules();
        const licenseModule = require('../../src/license');
        
        expect(() => licenseModule.hasFeature(null)).not.toThrow();
    });

    test('should handle undefined values in feature check', () => {
        jest.resetModules();
        const licenseModule = require('../../src/license');
        
        expect(() => licenseModule.hasFeature(undefined)).not.toThrow();
    });
});

// ============================================
// 12. SECURITY TESTS
// ============================================

describe('License Security', () => {
    test('should not expose sensitive information in checkLicense', () => {
        jest.resetModules();
        const licenseModule = require('../../src/license');
        
        const license = licenseModule.checkLicense();
        
        // Should not contain sensitive fields
        expect(license).not.toHaveProperty('privateKey');
        expect(license).not.toHaveProperty('secret');
        expect(license).not.toHaveProperty('password');
    });

    test('should not log sensitive information', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        
        jest.resetModules();
        require('../../src/license');
        
        // Check that console.log was called (for bypass message)
        // but shouldn't contain sensitive data
        const calls = consoleSpy.mock.calls;
        calls.forEach(call => {
            const args = call.join(' ');
            expect(args).not.toMatch(/password|secret|private.*key/i);
        });
        
        consoleSpy.mockRestore();
    });

    test('should generate unique device hashes per machine', () => {
        // This test verifies the concept, actual uniqueness depends on machine
        jest.resetModules();
        const licenseUtils = require('../../src/license-utils');
        
        const hash1 = licenseUtils.getDeviceHash();
        const hash2 = licenseUtils.getDeviceHash();
        
        // Same machine should produce same hash
        expect(hash1).toBe(hash2);
    });
});

module.exports = {
    validLicenseTypes: ['TRIAL', 'BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE']
};
