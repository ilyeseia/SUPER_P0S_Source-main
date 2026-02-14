# Frontend Development Guidelines - SUPER_P0S Cashier System

## Table of Contents
1. [Code Style Guide](#code-style-guide)
2. [UI Component Patterns](#ui-component-patterns)
3. [Accessibility Guidelines](#accessibility-guidelines)
4. [Performance Best Practices](#performance-best-practices)
5. [Security Guidelines](#security-guidelines)
6. [RTL Support](#rtl-support)

---

## Code Style Guide

### HTML Guidelines

#### Document Structure
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - SUPER_P0S</title>
    <!-- Stylesheets -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Content -->
</body>
</html>
```

#### Naming Conventions
- **IDs**: Use kebab-case with descriptive prefixes
  ```html
  <div id="pos-section"></div>
  <input id="customer-search" type="text">
  <button id="btn-login">تسجيل الدخول</button>
  ```

- **Classes**: Use BEM methodology or utility-first approach
  ```html
  <!-- BEM Style -->
  <div class="card">
    <div class="card__header">...</div>
    <div class="card__body">...</div>
  </div>
  
  <!-- Utility-first (preferred for this project) -->
  <div class="pm-container flex gap-15">
    <div class="pm-categories"></div>
  </div>
  ```

#### Semantic HTML
```html
<!-- ✅ Good - Semantic structure -->
<nav class="sidebar">...</nav>
<main class="content">
    <section id="pos-section">...</section>
    <article class="product-card">...</article>
</main>
<footer>...</footer>

<!-- ❌ Bad - Div soup -->
<div class="sidebar">...</div>
<div class="content">...</div>
```

#### Accessibility Attributes
```html
<!-- Always include aria labels for interactive elements -->
<button aria-label="إضافة منتج جديد" onclick="openProductModal()">
    + إضافة منتج
</button>

<!-- Include alt text for images -->
<img src="product.jpg" alt="صورة المنتج" class="product-image">

<!-- Use aria-live for dynamic content -->
<div aria-live="polite" id="cart-total">0.00</div>
```

### CSS Guidelines

#### CSS Custom Properties (Variables)
```css
/* Define in :root for global access */
:root {
    /* Colors */
    --primary-color: #2c3e50;
    --accent-color: #2980b9;
    --success-color: #27ae60;
    --danger-color: #c0392b;
    --warning-color: #f39c12;
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    
    /* Typography */
    --font-family: 'Cairo', sans-serif;
    --font-size-sm: 12px;
    --font-size-base: 14px;
    --font-size-lg: 16px;
    --font-size-xl: 20px;
    
    /* Layout */
    --sidebar-width: 220px;
    --border-radius: 8px;
    --border-color: #e1e4e8;
}
```

#### Selector Best Practices
```css
/* ✅ Good - Specific, maintainable */
.product-card {
    background: white;
    border-radius: var(--border-radius);
}

.product-card:hover {
    transform: translateY(-2px);
}

/* ❌ Bad - Overly specific, fragile */
#main-app .content .product-catalog .products-grid .product-card {
    background: white;
}
```

#### RTL Support
```css
/* Use logical properties for RTL support */
.element {
    /* ✅ Good - Works in both LTR and RTL */
    margin-inline-start: 10px;
    padding-inline-end: 20px;
    text-align: start;
    
    /* ❌ Bad - Breaks in RTL */
    margin-left: 10px;
    padding-right: 20px;
    text-align: left;
}

/* Or use RTL-specific overrides */
[dir="rtl"] .element {
    margin-right: 10px;
    margin-left: auto;
}
```

#### Responsive Design
```css
/* Mobile-first approach */
.products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}
```

### JavaScript Guidelines

#### Code Organization
```javascript
// ✅ Good - Modular, organized
const POS = {
    cart: [],
    
    init() {
        this.bindEvents();
        this.loadProducts();
    },
    
    bindEvents() {
        document.getElementById('checkout-btn')
            .addEventListener('click', () => this.checkout());
    },
    
    async loadProducts() {
        // Load products logic
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => POS.init());
```

#### Async/Await Pattern
```javascript
// ✅ Good - Clear async handling
async function loadProducts() {
    try {
        const products = await window.electron.invoke('product:getAll');
        renderProducts(products);
    } catch (error) {
        console.error('Failed to load products:', error);
        showNotification('خطأ في تحميل المنتجات', 'error');
    }
}

// ❌ Bad - Callback hell
function loadProducts() {
    window.electron.invoke('product:getAll', (products) => {
        renderProducts(products, () => {
            updateUI(() => {
                // More nested callbacks
            });
        });
    });
}
```

#### IPC Communication
```javascript
// ✅ Good - Structured IPC calls
const DatabaseAPI = {
    async query(sql, params = []) {
        return await window.electron.invoke('database:query', { sql, params });
    },
    
    async getProduct(id) {
        return await window.electron.invoke('product:getById', { id });
    },
    
    async createProduct(data) {
        return await window.electron.invoke('product:create', data);
    }
};

// Usage
const product = await DatabaseAPI.getProduct(123);
```

#### Event Handling
```javascript
// ✅ Good - Event delegation
document.getElementById('products-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
        addToCart(card.dataset.productId);
    }
});

// ❌ Bad - Individual handlers for each element
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => addToCart(card.dataset.productId));
});
```

#### Error Handling
```javascript
// ✅ Good - Comprehensive error handling
async function checkout() {
    if (this.cart.length === 0) {
        showNotification('السلة فارغة', 'warning');
        return;
    }
    
    try {
        const result = await window.electron.invoke('sale:create', {
            items: this.cart,
            total: this.calculateTotal()
        });
        
        if (result.success) {
            this.clearCart();
            printReceipt(result.receipt);
            showNotification('تمت العملية بنجاح', 'success');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Checkout failed:', error);
        showNotification(`فشل في إتمام العملية: ${error.message}`, 'error');
    }
}
```

---

## UI Component Patterns

### Button Components

```html
<!-- Primary Button -->
<button class="btn btn-primary" onclick="save()">
    حفظ
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary" onclick="cancel()">
    إلغاء
</button>

<!-- Danger Button -->
<button class="btn btn-danger" onclick="delete()">
    حذف
</button>

<!-- Icon Button -->
<button class="btn btn-icon" aria-label="بحث">
    🔍
</button>
```

```css
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
}

.btn-primary {
    background: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    background: #1c5985;
    transform: translateY(-1px);
}

.btn-secondary {
    background: #ecf0f1;
    color: #555;
}

.btn-danger {
    background: var(--danger-color);
    color: white;
}

.btn-icon {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50%;
}
```

### Card Components

```html
<!-- Product Card -->
<div class="product-card" data-product-id="123">
    <img src="product.jpg" alt="Product Name" class="product-card__image">
    <h3 class="product-card__name">اسم المنتج</h3>
    <span class="product-card__price">50.00 ر.س</span>
    <span class="product-card__stock">المخزون: 25</span>
</div>
```

```css
.product-card {
    background: white;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    padding: var(--spacing-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.product-card:hover {
    border-color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card--low-stock {
    border-color: var(--warning-color);
    background: #fff8e6;
}

.product-card--out-of-stock {
    border-color: var(--danger-color);
    background: #ffe6e6;
    opacity: 0.7;
    pointer-events: none;
}
```

### Modal Pattern

```html
<!-- Modal Structure -->
<div id="product-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-overlay" onclick="closeModal('product-modal')"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title">إضافة منتج جديد</h2>
            <button class="modal-close" onclick="closeModal('product-modal')" aria-label="إغلاق">
                &times;
            </button>
        </div>
        <div class="modal-body">
            <!-- Form content -->
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal('product-modal')">إلغاء</button>
            <button class="btn btn-primary" onclick="saveProduct()">حفظ</button>
        </div>
    </div>
</div>
```

```javascript
// Modal Management
const Modal = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element
        const focusable = modal.querySelector('input, button, select, textarea');
        if (focusable) focusable.focus();
        
        // Trap focus within modal
        this.trapFocus(modal);
    },
    
    close(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    },
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
            
            if (e.key === 'Escape') {
                this.close(modal.id);
            }
        });
    }
};
```

### Notification/Toast Pattern

```javascript
const Notification = {
    container: null,
    
    init() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.setAttribute('aria-live', 'polite');
        document.body.appendChild(this.container);
    },
    
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification__icon">${this.getIcon(type)}</span>
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="إغلاق">&times;</button>
        `;
        
        notification.querySelector('.notification__close')
            .addEventListener('click', () => this.dismiss(notification));
        
        this.container.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('notification--visible');
        });
        
        // Auto dismiss
        setTimeout(() => this.dismiss(notification), duration);
    },
    
    dismiss(notification) {
        notification.classList.remove('notification--visible');
        setTimeout(() => notification.remove(), 300);
    },
    
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
};
```

```css
.notification-container {
    position: fixed;
    top: var(--spacing-md);
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.notification {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: var(--spacing-sm) var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 300px;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.3s ease;
}

.notification--visible {
    transform: translateY(0);
    opacity: 1;
}

.notification--success {
    border-right: 4px solid var(--success-color);
}

.notification--error {
    border-right: 4px solid var(--danger-color);
}

.notification--warning {
    border-right: 4px solid var(--warning-color);
}
```

---

## Accessibility Guidelines

### Keyboard Navigation

#### Focus Management
```javascript
// Ensure all interactive elements are focusable
document.querySelectorAll('button, a, input, select, textarea')
    .forEach(el => {
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
    });

// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'انتقال إلى المحتوى الرئيسي';
document.body.insertBefore(skipLink, document.body.firstChild);
```

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent-color);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    z-index: 10000;
    transition: top 0.3s;
}

.skip-link:focus {
    top: 0;
}
```

#### Focus Indicators
```css
/* Visible focus indicator for all elements */
:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}

:focus:not(:focus-visible) {
    outline: none;
}

:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}

/* Custom focus for buttons */
button:focus-visible {
    box-shadow: 0 0 0 3px rgba(41, 128, 185, 0.3);
}
```

### ARIA Implementation

#### Labels and Descriptions
```html
<!-- Form fields with labels -->
<div class="form-group">
    <label id="product-name-label" for="product-name">اسم المنتج</label>
    <input 
        type="text" 
        id="product-name" 
        aria-labelledby="product-name-label"
        aria-describedby="product-name-hint"
        required
    >
    <span id="product-name-hint" class="hint">أدخل اسم المنتج باللغة العربية</span>
</div>

<!-- Error states -->
<input 
    type="text" 
    aria-invalid="true"
    aria-errormessage="product-name-error"
>
<span id="product-name-error" class="error-message" role="alert">
    حقل مطلوب
</span>
```

#### Live Regions
```html
<!-- Polite announcements (non-urgent) -->
<div aria-live="polite" id="cart-announcements" class="sr-only"></div>

<!-- Assertive announcements (urgent) -->
<div aria-live="assertive" id="error-announcements" class="sr-only"></div>
```

```javascript
// Announce to screen readers
function announce(message, priority = 'polite') {
    const region = document.getElementById(`${priority === 'assertive' ? 'error' : 'cart'}-announcements`);
    region.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
        region.textContent = '';
    }, 1000);
}

// Usage
announce('تمت إضافة المنتج إلى السلة');
announce('خطأ في الاتصال بالخادم', 'assertive');
```

### Screen Reader Support

```css
/* Screen reader only utility */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Hide visually but keep for screen readers */
.sr-only-focusable:focus,
.sr-only-focusable:active {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    white-space: normal;
}
```

### Color Contrast

```css
/* WCAG 2.1 AA minimum contrast ratios */
/* Normal text: 4.5:1 */
/* Large text: 3:1 */
/* UI components: 3:1 */

/* ✅ Good - Meets contrast requirements */
.text-primary {
    color: #2c3e50; /* 10.7:1 against white */
}

.text-secondary {
    color: #555555; /* 7.5:1 against white */
}

/* ❌ Bad - Insufficient contrast */
.text-light {
    color: #aaaaaa; /* 2.9:1 against white - FAILS */
}
```

### RTL Accessibility

```html
<!-- Ensure proper text direction -->
<html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <!-- Force RTL for Arabic content -->
        <style>
            body { direction: rtl; }
        </style>
    </head>
</html>
```

```css
/* RTL-aware positioning */
[dir="rtl"] .icon-before {
    margin-right: 0;
    margin-left: var(--spacing-sm);
}

[dir="ltr"] .icon-before {
    margin-left: 0;
    margin-right: var(--spacing-sm);
}
```

---

## Performance Best Practices

### DOM Manipulation

```javascript
// ✅ Good - Batch DOM updates
function renderProducts(products) {
    const container = document.getElementById('products-grid');
    const fragment = document.createDocumentFragment();
    
    products.forEach(product => {
        const card = createProductCard(product);
        fragment.appendChild(card);
    });
    
    container.innerHTML = '';
    container.appendChild(fragment);
}

// ❌ Bad - Multiple DOM updates
function renderProductsBad(products) {
    const container = document.getElementById('products-grid');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card); // Triggers reflow each time
    });
}
```

### Event Handling

```javascript
// ✅ Good - Event delegation
document.getElementById('products-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
        addToCart(card.dataset.productId);
    }
});

// ✅ Good - Debounce for search
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

searchInput.addEventListener('input', debounce((e) => {
    searchProducts(e.target.value);
}, 300));

// ✅ Good - Throttle for scroll
const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

scrollContainer.addEventListener('scroll', throttle(handleScroll, 100));
```

### Image Optimization

```html
<!-- Lazy loading -->
<img 
    src="product.jpg" 
    alt="Product name"
    loading="lazy"
    decoding="async"
    width="200"
    height="200"
>

<!-- Placeholder for broken images -->
<img 
    src="product.jpg" 
    alt="Product name"
    onerror="this.src='placeholder.png'"
>
```

```css
/* Prevent layout shift */
.product-card img {
    width: 100%;
    height: 120px;
    object-fit: contain;
    background: #f5f5f5;
}
```

### Memory Management

```javascript
// ✅ Good - Clean up event listeners
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
        this.element.addEventListener('click', this.handleClick);
    }
    
    destroy() {
        this.element.removeEventListener('click', this.handleClick);
    }
}

// ✅ Good - Clear intervals and timeouts
class AutoRefresh {
    start() {
        this.intervalId = setInterval(() => this.refresh(), 60000);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
```

### CSS Performance

```css
/* ✅ Good - Use transform for animations */
.product-card:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
}

/* ❌ Bad - Animating layout properties */
.product-card:hover {
    margin-top: -2px; /* Triggers layout */
}

/* ✅ Good - Use will-change sparingly */
.will-animate {
    will-change: transform;
}

/* Remove will-change after animation */
.animation-complete {
    will-change: auto;
}

/* ✅ Good - Contain for isolated components */
.product-card {
    contain: layout style;
}
```

---

## Security Guidelines

### Renderer Process Security

#### Context Isolation
```javascript
// preload.js - Expose only necessary APIs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, data) => {
        const validChannels = [
            'database:query',
            'product:getAll',
            'product:create',
            'sale:create',
            // Add all allowed channels
        ];
        
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
        
        throw new Error(`Invalid IPC channel: ${channel}`);
    }
});
```

#### Input Sanitization

```javascript
// ✅ Good - Sanitize user input
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove potential HTML
        .replace(/['"]/g, '') // Remove quotes
        .trim();
}

// ✅ Good - Validate and escape for SQL
async function searchProducts(query) {
    const sanitizedQuery = sanitizeInput(query);
    
    // Use parameterized queries (handled by backend)
    return await window.electron.invoke('product:search', { query: sanitizedQuery });
}

// ❌ Bad - Direct string interpolation
async function searchProductsBad(query) {
    const sql = `SELECT * FROM products WHERE name LIKE '%${query}%'`; // SQL Injection!
    return await window.electron.invoke('database:query', { sql });
}
```

#### XSS Prevention

```javascript
// ✅ Good - Use textContent for text
function updateProductName(name) {
    document.getElementById('product-name').textContent = name;
}

// ❌ Bad - Using innerHTML with user input
function updateProductNameBad(name) {
    document.getElementById('product-name').innerHTML = name; // XSS!
}

// ✅ Good - Sanitize HTML if needed
function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

// Or use DOMPurify library
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHTML);
```

### Data Protection

```javascript
// ✅ Good - Don't store sensitive data in localStorage
// Store only non-sensitive preferences
const Preferences = {
    save(key, value) {
        const allowedKeys = ['theme', 'language', 'rememberMe'];
        if (allowedKeys.includes(key)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    
    load(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    }
};

// ❌ Bad - Storing sensitive data
localStorage.setItem('password', password); // Never do this!
localStorage.setItem('token', authToken); // Never do this!
```

### Secure IPC Communication

```javascript
// ✅ Good - Validate IPC responses
async function createProduct(productData) {
    // Validate input before sending
    if (!productData.name || !productData.price) {
        throw new Error('Missing required fields');
    }
    
    try {
        const response = await window.electron.invoke('product:create', productData);
        
        // Validate response
        if (!response || !response.id) {
            throw new Error('Invalid server response');
        }
        
        return response;
    } catch (error) {
        console.error('Failed to create product:', error);
        throw error;
    }
}
```

### Form Security

```javascript
// ✅ Good - Validate form input
const FormValidator = {
    validateRequired(value, fieldName) {
        if (!value || value.trim() === '') {
            return { valid: false, error: `${fieldName} حقل مطلوب` };
        }
        return { valid: true };
    },
    
    validateNumber(value, fieldName, min = 0, max = Infinity) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return { valid: false, error: `${fieldName} يجب أن يكون رقماً` };
        }
        if (num < min || num > max) {
            return { valid: false, error: `${fieldName} يجب أن يكون بين ${min} و ${max}` };
        }
        return { valid: true };
    },
    
    validateBarcode(value) {
        if (!/^[a-zA-Z0-9-]+$/.test(value)) {
            return { valid: false, error: 'الباركود يحتوي أحرف غير صالحة' };
        }
        return { valid: true };
    }
};

// Usage
function validateProductForm(formData) {
    const errors = [];
    
    const nameResult = FormValidator.validateRequired(formData.name, 'اسم المنتج');
    if (!nameResult.valid) errors.push(nameResult.error);
    
    const priceResult = FormValidator.validateNumber(formData.price, 'السعر', 0.01);
    if (!priceResult.valid) errors.push(priceResult.error);
    
    return { valid: errors.length === 0, errors };
}
```

---

## RTL Support

### Text Direction

```css
/* Base RTL setup */
html {
    direction: rtl;
}

/* Or use attribute selector */
[dir="rtl"] {
    text-align: right;
}

[dir="ltr"] {
    text-align: left;
}

/* Logical properties (recommended) */
.element {
    /* Instead of margin-left/margin-right */
    margin-inline-start: 10px;
    margin-inline-end: 20px;
    
    /* Instead of padding-left/padding-right */
    padding-inline-start: 15px;
    padding-inline-end: 15px;
    
    /* Instead of text-align: left/right */
    text-align: start;
}
```

### Flexbox and Grid

```css
/* Flexbox automatically handles RTL */
.flex-container {
    display: flex;
    flex-direction: row; /* Automatically reverses in RTL */
    gap: var(--spacing-sm);
}

/* Grid works well with RTL */
.grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
}

/* If you need specific RTL adjustments */
[dir="rtl"] .specific-element {
    flex-direction: row-reverse;
}
```

### Icons and Arrows

```css
/* Icons that need flipping in RTL */
.icon-arrow {
    transition: transform 0.2s;
}

[dir="rtl"] .icon-arrow {
    transform: scaleX(-1);
}

/* Or use logical positioning */
.icon-before {
    display: inline-flex;
    align-items: center;
}

[dir="rtl"] .icon-before {
    flex-direction: row-reverse;
}
```

### Numbers and Dates

```html
<!-- Arabic numerals in RTL context -->
<span dir="ltr">123.45</span> <!-- Keep numbers LTR -->

<!-- Arabic date format -->
<span>15 ربيع الأول 1446</span>
```

```css
/* Mixed content handling */
.mixed-content {
    unicode-bidi: plaintext;
}

/* Numbers in RTL */
.price {
    direction: ltr;
    display: inline-block;
    unicode-bidi: embed;
}
```

### Typography for Arabic

```css
/* Arabic font stack */
:root {
    --font-arabic: 'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif;
    --font-english: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
}

body {
    font-family: var(--font-arabic);
}

/* English content within Arabic */
.english-text {
    font-family: var(--font-english);
    direction: ltr;
}
```

### Form Elements

```css
/* RTL form alignment */
.form-group {
    text-align: start;
}

.form-group label {
    display: block;
    margin-block-end: var(--spacing-xs);
}

/* Input placeholders */
[dir="rtl"] input::placeholder {
    text-align: right;
}

/* Checkbox and radio alignment */
.checkbox-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

[dir="rtl"] .checkbox-group input[type="checkbox"] {
    margin-inline-end: var(--spacing-sm);
}
```

---

## Checklist for New Features

### Before Implementation
- [ ] Review design specifications
- [ ] Check RTL compatibility requirements
- [ ] Identify accessibility requirements
- [ ] Plan component structure

### During Implementation
- [ ] Follow naming conventions
- [ ] Use CSS custom properties
- [ ] Implement keyboard navigation
- [ ] Add ARIA attributes
- [ ] Handle loading and error states
- [ ] Test with screen reader

### Before Deployment
- [ ] Run ESLint/Prettier
- [ ] Test RTL layout
- [ ] Verify color contrast
- [ ] Test keyboard navigation
- [ ] Check focus indicators
- [ ] Validate form inputs
- [ ] Test with slow network
- [ ] Review security implications

---

*Last Updated: 2024*
*Version: 1.0*
