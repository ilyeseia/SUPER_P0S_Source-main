/**
 * Accessibility Utilities for SUPER_P0S Cashier System
 * 
 * This module provides accessibility utilities for the Electron POS application.
 * It includes focus management, screen reader announcements, keyboard navigation,
 * and RTL support utilities.
 * 
 * @module accessibility
 * @version 1.0.0
 */

const Accessibility = (function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        // Focus trap selectors
        focusableSelector: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        
        // Animation durations
        animationDuration: 300,
        
        // Debounce delay
        debounceDelay: 100,
        
        // ARIA live region IDs
        politeRegionId: 'a11y-announcements-polite',
        assertiveRegionId: 'a11y-announcements-assertive'
    };

    // ============================================
    // LIVE REGIONS (Screen Reader Announcements)
    // ============================================

    /**
     * Initialize ARIA live regions for screen reader announcements
     */
    function initLiveRegions() {
        // Create polite region
        if (!document.getElementById(CONFIG.politeRegionId)) {
            const politeRegion = document.createElement('div');
            politeRegion.id = CONFIG.politeRegionId;
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            politeRegion.className = 'sr-only';
            politeRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(politeRegion);
        }

        // Create assertive region
        if (!document.getElementById(CONFIG.assertiveRegionId)) {
            const assertiveRegion = document.createElement('div');
            assertiveRegion.id = CONFIG.assertiveRegionId;
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            assertiveRegion.className = 'sr-only';
            assertiveRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(assertiveRegion);
        }
    }

    /**
     * Announce a message to screen readers
     * @param {string} message - The message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    function announce(message, priority = 'polite') {
        initLiveRegions();
        
        const regionId = priority === 'assertive' 
            ? CONFIG.assertiveRegionId 
            : CONFIG.politeRegionId;
        const region = document.getElementById(regionId);
        
        if (region) {
            // Clear previous announcement
            region.textContent = '';
            
            // Set new announcement after a brief delay (ensures screen readers catch it)
            setTimeout(() => {
                region.textContent = message;
                
                // Clear after announcement
                setTimeout(() => {
                    region.textContent = '';
                }, 1000);
            }, 50);
        }
    }

    // ============================================
    // FOCUS MANAGEMENT
    // ============================================

    /**
     * Get all focusable elements within a container
     * @param {HTMLElement} container - The container to search
     * @returns {NodeList} - List of focusable elements
     */
    function getFocusableElements(container = document) {
        return container.querySelectorAll(CONFIG.focusableSelector);
    }

    /**
     * Focus the first focusable element within a container
     * @param {HTMLElement} container - The container to search
     * @returns {boolean} - Whether an element was focused
     */
    function focusFirst(container) {
        const focusable = getFocusableElements(container);
        if (focusable.length > 0) {
            focusable[0].focus();
            return true;
        }
        return false;
    }

    /**
     * Focus the last focusable element within a container
     * @param {HTMLElement} container - The container to search
     * @returns {boolean} - Whether an element was focused
     */
    function focusLast(container) {
        const focusable = getFocusableElements(container);
        if (focusable.length > 0) {
            focusable[focusable.length - 1].focus();
            return true;
        }
        return false;
    }

    /**
     * Trap focus within a container (for modals, dialogs, etc.)
     * @param {HTMLElement} container - The container to trap focus in
     * @returns {Function} - Cleanup function to remove the trap
     */
    function trapFocus(container) {
        const focusable = getFocusableElements(container);
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        function handleKeyDown(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        container.addEventListener('keydown', handleKeyDown);

        // Return cleanup function
        return function cleanup() {
            container.removeEventListener('keydown', handleKeyDown);
        };
    }

    /**
     * Save the current focus and return a restore function
     * @returns {Function} - Function to restore focus
     */
    function saveFocus() {
        const activeElement = document.activeElement;
        return function restoreFocus() {
            if (activeElement && typeof activeElement.focus === 'function') {
                activeElement.focus();
            }
        };
    }

    /**
     * Manage focus for a modal dialog
     * @param {HTMLElement} modal - The modal element
     * @returns {Object} - Object with open and close methods
     */
    function modalFocusManager(modal) {
        let restoreFocus = null;
        let cleanupTrap = null;

        return {
            open() {
                // Save current focus
                restoreFocus = saveFocus();
                
                // Show modal
                modal.classList.remove('hidden');
                modal.setAttribute('aria-hidden', 'false');
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                // Focus first element
                setTimeout(() => focusFirst(modal), 50);
                
                // Trap focus
                cleanupTrap = trapFocus(modal);
                
                // Announce to screen readers
                const title = modal.querySelector('[role="heading"], h1, h2, h3');
                if (title) {
                    announce(`تم فتح ${title.textContent}`, 'assertive');
                }
            },
            
            close() {
                // Hide modal
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
                
                // Restore body scroll
                document.body.style.overflow = '';
                
                // Clean up focus trap
                if (cleanupTrap) {
                    cleanupTrap();
                    cleanupTrap = null;
                }
                
                // Restore previous focus
                if (restoreFocus) {
                    restoreFocus();
                    restoreFocus = null;
                }
            }
        };
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================

    /**
     * Handle keyboard navigation for a list of items
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.container - Container element
     * @param {string} options.itemSelector - Selector for list items
     * @param {Function} options.onSelect - Callback when item is selected
     * @param {Function} options.onEscape - Callback when Escape is pressed
     * @param {string} options.selectedClass - CSS class for selected item
     */
    function listNavigation(options) {
        const {
            container,
            itemSelector,
            onSelect,
            onEscape,
            selectedClass = 'selected'
        } = options;

        let selectedIndex = -1;
        let items = [];

        function updateItems() {
            items = Array.from(container.querySelectorAll(itemSelector));
        }

        function selectItem(index) {
            // Remove selection from all items
            items.forEach(item => {
                item.classList.remove(selectedClass);
                item.setAttribute('aria-selected', 'false');
            });

            // Select new item
            if (index >= 0 && index < items.length) {
                selectedIndex = index;
                items[index].classList.add(selectedClass);
                items[index].setAttribute('aria-selected', 'true');
                items[index].scrollIntoView({ block: 'nearest' });
                
                // Announce selection
                announce(items[index].textContent);
            } else {
                selectedIndex = -1;
            }
        }

        function handleKeyDown(e) {
            updateItems();

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (selectedIndex < items.length - 1) {
                        selectItem(selectedIndex + 1);
                    } else {
                        selectItem(0);
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (selectedIndex > 0) {
                        selectItem(selectedIndex - 1);
                    } else {
                        selectItem(items.length - 1);
                    }
                    break;

                case 'Home':
                    e.preventDefault();
                    selectItem(0);
                    break;

                case 'End':
                    e.preventDefault();
                    selectItem(items.length - 1);
                    break;

                case 'Enter':
                case ' ':
                    if (selectedIndex >= 0 && onSelect) {
                        e.preventDefault();
                        onSelect(items[selectedIndex], selectedIndex);
                    }
                    break;

                case 'Escape':
                    if (onEscape) {
                        e.preventDefault();
                        onEscape();
                    }
                    break;
            }
        }

        container.addEventListener('keydown', handleKeyDown);

        // Return cleanup function and utilities
        return {
            cleanup() {
                container.removeEventListener('keydown', handleKeyDown);
            },
            selectItem,
            updateItems,
            getSelectedIndex() {
                return selectedIndex;
            },
            getSelectedItem() {
                return items[selectedIndex] || null;
            }
        };
    }

    /**
     * Handle keyboard shortcuts
     * @param {Object} shortcuts - Object mapping key combinations to handlers
     * @returns {Function} - Cleanup function
     */
    function keyboardShortcuts(shortcuts) {
        function handleKeyDown(e) {
            const key = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;
            const alt = e.altKey;
            const shift = e.shiftKey;

            for (const [combo, handler] of Object.entries(shortcuts)) {
                const parts = combo.toLowerCase().split('+');
                const comboKey = parts[parts.length - 1];
                const comboCtrl = parts.includes('ctrl');
                const comboAlt = parts.includes('alt');
                const comboShift = parts.includes('shift');

                if (
                    key === comboKey &&
                    ctrl === comboCtrl &&
                    alt === comboAlt &&
                    shift === comboShift
                ) {
                    e.preventDefault();
                    handler(e);
                    return;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }

    // ============================================
    // FORM ACCESSIBILITY
    // ============================================

    /**
     * Mark a form field as invalid and show error
     * @param {HTMLElement} field - The form field
     * @param {string} message - Error message
     */
    function setFieldError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        
        // Create or update error message element
        let errorEl = document.getElementById(`${field.id}-error`);
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.id = `${field.id}-error`;
            errorEl.className = 'error-message';
            errorEl.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        field.setAttribute('aria-errormessage', errorEl.id);
        
        // Announce error
        announce(message, 'assertive');
    }

    /**
     * Clear error state from a form field
     * @param {HTMLElement} field - The form field
     */
    function clearFieldError(field) {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-errormessage');
        
        const errorEl = document.getElementById(`${field.id}-error`);
        if (errorEl) {
            errorEl.textContent = '';
        }
    }

    /**
     * Validate and announce form errors
     * @param {HTMLFormElement} form - The form to validate
     * @param {Object} rules - Validation rules
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm(form, rules) {
        let isValid = true;
        const errors = [];

        // Clear all previous errors
        form.querySelectorAll('[aria-invalid]').forEach(field => {
            clearFieldError(field);
        });

        // Validate each field
        for (const [fieldName, fieldRules] of Object.entries(rules)) {
            const field = form.elements[fieldName];
            if (!field) continue;

            for (const rule of fieldRules) {
                const value = field.value.trim();
                let fieldValid = true;
                let errorMessage = '';

                switch (rule.type) {
                    case 'required':
                        if (!value) {
                            fieldValid = false;
                            errorMessage = rule.message || `${fieldName} حقل مطلوب`;
                        }
                        break;

                    case 'minLength':
                        if (value.length < rule.value) {
                            fieldValid = false;
                            errorMessage = rule.message || `${fieldName} يجب أن يكون على الأقل ${rule.value} أحرف`;
                        }
                        break;

                    case 'maxLength':
                        if (value.length > rule.value) {
                            fieldValid = false;
                            errorMessage = rule.message || `${fieldName} يجب أن لا يتجاوز ${rule.value} أحرف`;
                        }
                        break;

                    case 'pattern':
                        if (!rule.value.test(value)) {
                            fieldValid = false;
                            errorMessage = rule.message || `${fieldName} تنسيق غير صالح`;
                        }
                        break;

                    case 'custom':
                        if (!rule.validator(value, form)) {
                            fieldValid = false;
                            errorMessage = rule.message || `${fieldName} قيمة غير صالحة`;
                        }
                        break;
                }

                if (!fieldValid) {
                    setFieldError(field, errorMessage);
                    errors.push(errorMessage);
                    isValid = false;
                    break; // Stop at first error for this field
                }
            }
        }

        // Announce errors summary
        if (!isValid) {
            announce(`يوجد ${errors.length} أخطاء في النموذج. ${errors[0]}`, 'assertive');
            focusFirstInvalidField(form);
        }

        return isValid;
    }

    /**
     * Focus the first invalid field in a form
     * @param {HTMLFormElement} form - The form
     */
    function focusFirstInvalidField(form) {
        const invalidField = form.querySelector('[aria-invalid="true"]');
        if (invalidField) {
            invalidField.focus();
        }
    }

    // ============================================
    // RTL UTILITIES
    // ============================================

    /**
     * Check if the document is in RTL mode
     * @returns {boolean} - Whether RTL is active
     */
    function isRTL() {
        return document.documentElement.dir === 'rtl' || 
               document.documentElement.getAttribute('dir') === 'rtl';
    }

    /**
     * Get the appropriate direction-aware property
     * @param {string} ltrValue - Value for LTR
     * @param {string} rtlValue - Value for RTL
     * @returns {string} - The appropriate value
     */
    function getDirectionValue(ltrValue, rtlValue) {
        return isRTL() ? rtlValue : ltrValue;
    }

    /**
     * Convert left/right to start/end based on direction
     * @param {string} property - 'left' or 'right'
     * @returns {string} - 'start' or 'end'
     */
    function toLogical(property) {
        if (property === 'left') {
            return isRTL() ? 'end' : 'start';
        } else if (property === 'right') {
            return isRTL() ? 'start' : 'end';
        }
        return property;
    }

    /**
     * Set direction-aware style property
     * @param {HTMLElement} element - Target element
     * @param {string} property - CSS property name
     * @param {string|number} ltrValue - Value for LTR
     * @param {string|number} rtlValue - Value for RTL
     */
    function setDirectionalStyle(element, property, ltrValue, rtlValue) {
        element.style[property] = isRTL() ? rtlValue : ltrValue;
    }

    /**
     * Flip an element horizontally (for icons, arrows, etc.)
     * @param {HTMLElement} element - Element to flip
     * @param {boolean} flip - Whether to flip
     */
    function flipForRTL(element, flip = true) {
        if (isRTL() && flip) {
            element.style.transform = 'scaleX(-1)';
        } else {
            element.style.transform = '';
        }
    }

    // ============================================
    // ACCESSIBILITY CHECKS
    // ============================================

    /**
     * Run basic accessibility checks on the page
     * @returns {Array} - Array of issues found
     */
    function runAccessibilityChecks() {
        const issues = [];

        // Check for images without alt text
        document.querySelectorAll('img:not([alt])').forEach(img => {
            issues.push({
                type: 'error',
                message: 'صورة بدون نص بديل',
                element: img
            });
        });

        // Check for form fields without labels
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (!field.getAttribute('aria-label') && 
                !field.getAttribute('aria-labelledby') &&
                !document.querySelector(`label[for="${field.id}"]`)) {
                issues.push({
                    type: 'error',
                    message: 'حقل نموذج بدون تسمية',
                    element: field
                });
            }
        });

        // Check for buttons without accessible text
        document.querySelectorAll('button').forEach(button => {
            if (!button.textContent.trim() && 
                !button.getAttribute('aria-label') &&
                !button.getAttribute('aria-labelledby')) {
                issues.push({
                    type: 'error',
                    message: 'زر بدون نص يمكن الوصول إليه',
                    element: button
                });
            }
        });

        // Check for missing heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level - lastLevel > 1) {
                issues.push({
                    type: 'warning',
                    message: `فجوة في تسلسل العناوين: من H${lastLevel} إلى H${level}`,
                    element: heading
                });
            }
            lastLevel = level;
        });

        // Check for missing skip links
        if (!document.querySelector('.skip-link, [href="#main-content"]')) {
            issues.push({
                type: 'warning',
                message: 'لا يوجد رابط تخطي للمحتوى الرئيسي',
                element: document.body
            });
        }

        // Check for insufficient color contrast (basic check)
        // This is a simplified check - use a proper tool for accurate results
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Only flag elements with text
            if (el.textContent.trim() && color && bgColor) {
                // Basic contrast ratio check would go here
                // For now, just log potential issues
            }
        });

        return issues;
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Debounce a function
     * @param {Function} fn - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(fn, delay = CONFIG.debounceDelay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Create a skip link
     * @param {string} targetId - ID of the target element
     * @param {string} text - Link text
     */
    function createSkipLink(targetId, text = 'انتقال إلى المحتوى الرئيسي') {
        const skipLink = document.createElement('a');
        skipLink.href = `#${targetId}`;
        skipLink.className = 'skip-link';
        skipLink.textContent = text;
        
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: #2980b9;
            color: white;
            padding: 8px 16px;
            z-index: 9999;
            transition: top 0.2s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Set up accessible tooltips
     * @param {string} selector - Selector for elements with tooltips
     */
    function setupTooltips(selector = '[data-tooltip]') {
        document.querySelectorAll(selector).forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.setAttribute('role', 'tooltip');
            tooltip.className = 'tooltip sr-only';
            tooltip.textContent = tooltipText;
            tooltip.id = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
            
            // Link element to tooltip
            element.setAttribute('aria-describedby', tooltip.id);
            element.appendChild(tooltip);
            
            // Show/hide on focus
            element.addEventListener('focus', () => {
                tooltip.classList.remove('sr-only');
            });
            
            element.addEventListener('blur', () => {
                tooltip.classList.add('sr-only');
            });
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize accessibility features
     */
    function init() {
        // Initialize live regions
        initLiveRegions();
        
        // Create skip link if main content exists
        const mainContent = document.getElementById('main-content') || 
                           document.querySelector('main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
        if (mainContent) {
            createSkipLink('main-content');
        }
        
        // Set up keyboard navigation for common patterns
        setupCommonPatterns();
        
        console.log('Accessibility module initialized');
    }

    /**
     * Set up common accessibility patterns
     */
    function setupCommonPatterns() {
        // Add focus visible polyfill behavior
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add global escape key handler for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    const closeBtn = openModal.querySelector('.close-modal, [data-close-modal]');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            }
        });
    }

    // ============================================
    // PUBLIC API
    // ============================================

    return {
        // Initialization
        init,
        
        // Announcements
        announce,
        initLiveRegions,
        
        // Focus management
        getFocusableElements,
        focusFirst,
        focusLast,
        trapFocus,
        saveFocus,
        modalFocusManager,
        
        // Keyboard navigation
        listNavigation,
        keyboardShortcuts,
        
        // Form accessibility
        setFieldError,
        clearFieldError,
        validateForm,
        focusFirstInvalidField,
        
        // RTL utilities
        isRTL,
        getDirectionValue,
        toLogical,
        setDirectionalStyle,
        flipForRTL,
        
        // Accessibility checks
        runAccessibilityChecks,
        
        // Utilities
        debounce,
        createSkipLink,
        setupTooltips,
        
        // Configuration
        CONFIG
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Accessibility.init());
} else {
    Accessibility.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Accessibility;
}

// Example Usage:
/*
// Screen reader announcement
Accessibility.announce('تم إضافة المنتج إلى السلة');

// Focus trap for modal
const modal = document.getElementById('my-modal');
const focusManager = Accessibility.modalFocusManager(modal);
focusManager.open();
// Later: focusManager.close();

// Keyboard shortcuts
Accessibility.keyboardShortcuts({
    'ctrl+f': () => document.getElementById('search').focus(),
    'ctrl+s': () => saveDocument(),
    'escape': () => closeModal()
});

// List navigation
const listNav = Accessibility.listNavigation({
    container: document.getElementById('search-results'),
    itemSelector: '.search-item',
    onSelect: (item, index) => {
        console.log('Selected:', item);
    },
    onEscape: () => {
        console.log('Escape pressed');
    }
});

// RTL utilities
if (Accessibility.isRTL()) {
    Accessibility.flipForRTL(arrowIcon);
}

// Form validation
const isValid = Accessibility.validateForm(document.getElementById('product-form'), {
    name: [
        { type: 'required', message: 'اسم المنتج مطلوب' },
        { type: 'minLength', value: 3, message: 'الاسم قصير جداً' }
    ],
    price: [
        { type: 'required', message: 'السعر مطلوب' },
        { type: 'custom', validator: (val) => parseFloat(val) > 0, message: 'السعر يجب أن يكون أكبر من صفر' }
    ]
});
*/
