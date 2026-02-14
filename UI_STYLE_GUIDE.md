# UI Style Guide - SUPER_P0S Cashier System

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Component Styles](#component-styles)
5. [RTL Layout Guidelines](#rtl-layout-guidelines)
6. [Iconography](#iconography)
7. [Animation and Transitions](#animation-and-transitions)
8. [Responsive Design](#responsive-design)

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Primary Dark | `#2c3e50` | rgb(44, 62, 80) | Sidebar, headers, primary text |
| Primary Light | `#34495e` | rgb(52, 73, 94) | Secondary headers, borders |
| Accent Blue | `#2980b9` | rgb(41, 128, 185) | Interactive elements, links |
| Accent Blue Dark | `#1c5985` | rgb(28, 89, 133) | Hover states |

```css
:root {
    --color-primary: #2c3e50;
    --color-primary-light: #34495e;
    --color-primary-dark: #1a252f;
    --color-accent: #2980b9;
    --color-accent-dark: #1c5985;
    --color-accent-light: #3498db;
}
```

### Semantic Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Success | `#27ae60` | rgb(39, 174, 96) | Success states, prices, confirmations |
| Success Dark | `#219150` | rgb(33, 145, 80) | Hover states for success |
| Danger | `#c0392b` | rgb(192, 57, 43) | Errors, delete actions |
| Danger Light | `#e74c3c` | rgb(231, 76, 60) | Danger hover states |
| Warning | `#f39c12` | rgb(243, 156, 18) | Warnings, low stock alerts |
| Warning Light | `#fff3e0` | rgb(255, 243, 224) | Warning backgrounds |
| Info | `#3498db` | rgb(52, 152, 219) | Information, tips |

```css
:root {
    --color-success: #27ae60;
    --color-success-dark: #219150;
    --color-success-light: #e8f5e9;
    
    --color-danger: #c0392b;
    --color-danger-light: #e74c3c;
    --color-danger-bg: #ffebee;
    
    --color-warning: #f39c12;
    --color-warning-dark: #e67e22;
    --color-warning-bg: #fff8e6;
    
    --color-info: #3498db;
    --color-info-bg: #ebf5fb;
}
```

### Neutral Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| White | `#ffffff` | Backgrounds, cards |
| Light Gray | `#f0f2f5` | Page background |
| Border Gray | `#e1e4e8` | Borders, dividers |
| Medium Gray | `#bdc3c7` | Disabled states |
| Text Gray | `#7f8c8d` | Secondary text |
| Dark Gray | `#555555` | Body text |
| Near Black | `#333333` | Primary text |

```css
:root {
    --color-white: #ffffff;
    --color-gray-50: #fafafa;
    --color-gray-100: #f5f7fa;
    --color-gray-200: #eef1f5;
    --color-gray-300: #e1e4e8;
    --color-gray-400: #d1d5db;
    --color-gray-500: #9ca3af;
    --color-gray-600: #7f8c8d;
    --color-gray-700: #555555;
    --color-gray-800: #333333;
    --color-gray-900: #1a1a1a;
}
```

### Background Colors

```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f7fa;
    --bg-tertiary: #eef1f5;
    --bg-dark: #2c3e50;
    --bg-overlay: rgba(0, 0, 0, 0.5);
}
```

### Stock Status Colors

```css
:root {
    /* In Stock */
    --stock-in-stock: #27ae60;
    --stock-in-stock-bg: #e8f5e9;
    
    /* Low Stock */
    --stock-low: #f39c12;
    --stock-low-bg: #fff8e6;
    
    /* Out of Stock */
    --stock-out: #e74c3c;
    --stock-out-bg: #ffebee;
}
```

### Payment Method Colors

```css
:root {
    --payment-cash: #27ae60;
    --payment-cash-bg: #e8f5e9;
    
    --payment-card: #3498db;
    --payment-card-bg: #ebf5fb;
    
    --payment-credit: #f39c12;
    --payment-credit-bg: #fff8e6;
    
    --payment-split: #9b59b6;
    --payment-split-bg: #f3e5f5;
}
```

### Color Usage Guidelines

#### Text Colors
- **Primary Text**: `#333333` - Main content, headings
- **Secondary Text**: `#555555` - Labels, descriptions
- **Muted Text**: `#7f8c8d` - Placeholders, hints
- **Link Text**: `#2980b9` - Interactive links
- **Success Text**: `#27ae60` - Prices, confirmations
- **Error Text**: `#c0392b` - Error messages

#### Background Colors
- **Page Background**: `#f0f2f5` or `#eef1f5`
- **Card Background**: `#ffffff`
- **Sidebar Background**: `#2c3e50`
- **Modal Overlay**: `rgba(0, 0, 0, 0.5)`

#### Border Colors
- **Default Border**: `#e1e4e8`
- **Hover Border**: `#d1d5db`
- **Focus Border**: `#2980b9`
- **Error Border**: `#e74c3c`

---

## Typography

### Font Family

```css
:root {
    --font-primary: 'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif;
    --font-english: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
    --font-mono: 'Courier New', 'Consolas', monospace;
}

/* Font Face Declarations */
@font-face {
    font-family: 'Cairo';
    src: url('assets/fonts/Cairo-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Cairo';
    src: url('assets/fonts/Cairo-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Cairo';
    src: url('assets/fonts/Cairo-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Cairo';
    src: url('assets/fonts/Cairo-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Cairo';
    src: url('assets/fonts/Cairo-ExtraBold.ttf') format('truetype');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
}
```

### Font Sizes

| Size Name | Size | Line Height | Usage |
|-----------|------|-------------|-------|
| xs | 10px | 1.4 | Badges, tags |
| sm | 12px | 1.4 | Labels, hints, small text |
| base | 14px | 1.5 | Body text, form labels |
| md | 16px | 1.5 | Emphasized body text |
| lg | 18px | 1.4 | Section headings |
| xl | 20px | 1.3 | Card titles |
| 2xl | 24px | 1.2 | Page headings |
| 3xl | 32px | 1.2 | Large display text |

```css
:root {
    --text-xs: 10px;
    --text-sm: 12px;
    --text-base: 14px;
    --text-md: 16px;
    --text-lg: 18px;
    --text-xl: 20px;
    --text-2xl: 24px;
    --text-3xl: 32px;
    --text-4xl: 38px;
    
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.7;
}
```

### Font Weights

| Weight Name | Value | Usage |
|-------------|-------|-------|
| Light | 300 | Subtle text |
| Regular | 400 | Body text |
| Semi-Bold | 600 | Emphasis, labels |
| Bold | 700 | Headings, buttons |
| Extra Bold | 800 | Large headings, totals |

```css
:root {
    --font-light: 300;
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    --font-extrabold: 800;
}
```

### Typography Classes

```css
/* Headings */
.text-heading-1 {
    font-size: var(--text-3xl);
    font-weight: var(--font-extrabold);
    line-height: var(--leading-tight);
    color: var(--color-primary);
}

.text-heading-2 {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    color: var(--color-primary);
}

.text-heading-3 {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    color: var(--color-gray-800);
}

.text-heading-4 {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    line-height: var(--leading-normal);
    color: var(--color-gray-700);
}

/* Body Text */
.text-body {
    font-size: var(--text-base);
    font-weight: var(--font-normal);
    line-height: var(--leading-normal);
    color: var(--color-gray-800);
}

.text-body-sm {
    font-size: var(--text-sm);
    font-weight: var(--font-normal);
    line-height: var(--leading-normal);
    color: var(--color-gray-700);
}

.text-caption {
    font-size: var(--text-xs);
    font-weight: var(--font-normal);
    line-height: var(--leading-normal);
    color: var(--color-gray-600);
}

/* Labels */
.text-label {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-gray-700);
}

/* Price Display */
.text-price {
    font-size: var(--text-xl);
    font-weight: var(--font-extrabold);
    color: var(--color-success);
    font-variant-numeric: tabular-nums;
}

.text-price-lg {
    font-size: var(--text-2xl);
    font-weight: var(--font-extrabold);
    color: var(--color-success);
}
```

### Arabic Typography Notes

1. **Line Height**: Arabic text requires slightly higher line-height (1.5-1.7) for readability
2. **Letter Spacing**: Generally avoid letter-spacing for Arabic
3. **Text Alignment**: Use `text-align: right` or `start` for RTL
4. **Font Selection**: Use fonts designed for Arabic (Cairo, Tajawal, IBM Plex Sans Arabic)

---

## Spacing System

### Base Unit

The spacing system uses a base unit of **4px**. All spacing values are multiples of this base unit.

### Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| spacing-0 | 0 | 0px | No spacing |
| spacing-1 | 0.25rem | 4px | Tight spacing, inline gaps |
| spacing-2 | 0.5rem | 8px | Small gaps, icon spacing |
| spacing-3 | 0.75rem | 12px | Medium gaps |
| spacing-4 | 1rem | 16px | Standard padding/margin |
| spacing-5 | 1.25rem | 20px | Large padding |
| spacing-6 | 1.5rem | 24px | Section padding |
| spacing-8 | 2rem | 32px | Large sections |
| spacing-10 | 2.5rem | 40px | Page sections |
| spacing-12 | 3rem | 48px | Major sections |
| spacing-16 | 4rem | 64px | Hero sections |

```css
:root {
    --spacing-0: 0;
    --spacing-1: 4px;
    --spacing-2: 8px;
    --spacing-3: 12px;
    --spacing-4: 16px;
    --spacing-5: 20px;
    --spacing-6: 24px;
    --spacing-8: 32px;
    --spacing-10: 40px;
    --spacing-12: 48px;
    --spacing-16: 64px;
    
    /* Aliases */
    --spacing-xs: var(--spacing-1);
    --spacing-sm: var(--spacing-2);
    --spacing-md: var(--spacing-4);
    --spacing-lg: var(--spacing-6);
    --spacing-xl: var(--spacing-8);
}
```

### Component Spacing

```css
/* Card Padding */
.card {
    padding: var(--spacing-4);
}

.card--compact {
    padding: var(--spacing-3);
}

.card--spacious {
    padding: var(--spacing-6);
}

/* Section Margins */
.section {
    margin-bottom: var(--spacing-6);
}

.section--large {
    margin-bottom: var(--spacing-10);
}

/* Form Group Spacing */
.form-group {
    margin-bottom: var(--spacing-4);
}

.form-group--tight {
    margin-bottom: var(--spacing-2);
}

/* Grid Gaps */
.grid {
    display: grid;
    gap: var(--spacing-3);
}

.grid--tight {
    gap: var(--spacing-2);
}

.grid--wide {
    gap: var(--spacing-6);
}
```

### Layout Spacing

```css
/* Sidebar Width */
:root {
    --sidebar-width: 220px;
    --sidebar-width-collapsed: 60px;
}

/* Content Padding */
.content {
    padding: var(--spacing-4);
}

/* Container Widths */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
}

.container--narrow {
    max-width: 800px;
}

.container--wide {
    max-width: 1400px;
}
```

---

## Component Styles

### Buttons

```css
/* Base Button */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-4);
    font-family: var(--font-primary);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    line-height: 1;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Button Sizes */
.btn--sm {
    padding: var(--spacing-1) var(--spacing-3);
    font-size: var(--text-sm);
}

.btn--lg {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--text-lg);
}

/* Button Variants */
.btn--primary {
    background: var(--color-accent);
    color: white;
}

.btn--primary:hover {
    background: var(--color-accent-dark);
    transform: translateY(-1px);
}

.btn--secondary {
    background: var(--color-gray-200);
    color: var(--color-gray-700);
}

.btn--secondary:hover {
    background: var(--color-gray-300);
}

.btn--success {
    background: var(--color-success);
    color: white;
}

.btn--success:hover {
    background: var(--color-success-dark);
}

.btn--danger {
    background: var(--color-danger-light);
    color: white;
}

.btn--danger:hover {
    background: var(--color-danger);
}

.btn--ghost {
    background: transparent;
    color: var(--color-gray-700);
}

.btn--ghost:hover {
    background: var(--color-gray-100);
}

/* Icon Button */
.btn--icon {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: var(--radius-md);
}

.btn--icon.btn--sm {
    width: 28px;
    height: 28px;
}

.btn--icon.btn--lg {
    width: 44px;
    height: 44px;
}
```

### Form Elements

```css
/* Input Fields */
.input {
    width: 100%;
    padding: var(--spacing-2) var(--spacing-3);
    font-family: var(--font-primary);
    font-size: var(--text-base);
    color: var(--color-gray-800);
    background: white;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(41, 128, 185, 0.1);
    outline: none;
}

.input::placeholder {
    color: var(--color-gray-500);
}

.input:disabled {
    background: var(--color-gray-100);
    cursor: not-allowed;
}

/* Input States */
.input--error {
    border-color: var(--color-danger-light);
}

.input--error:focus {
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.input--success {
    border-color: var(--color-success);
}

/* Input Sizes */
.input--sm {
    padding: var(--spacing-1) var(--spacing-2);
    font-size: var(--text-sm);
}

.input--lg {
    padding: var(--spacing-3) var(--spacing-4);
    font-size: var(--text-lg);
}

/* Select */
.select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: left var(--spacing-3) center;
    padding-left: var(--spacing-8);
}

[dir="rtl"] .select {
    background-position: right var(--spacing-3) center;
    padding-left: var(--spacing-3);
    padding-right: var(--spacing-8);
}

/* Checkbox */
.checkbox {
    width: 18px;
    height: 18px;
    accent-color: var(--color-accent);
    cursor: pointer;
}

/* Labels */
.label {
    display: block;
    margin-bottom: var(--spacing-1);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-gray-700);
}

.label--required::after {
    content: ' *';
    color: var(--color-danger-light);
}
```

### Cards

```css
/* Base Card */
.card {
    background: white;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.card--shadow {
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card--hover:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

/* Card Parts */
.card__header {
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--color-gray-200);
    font-weight: var(--font-bold);
}

.card__body {
    padding: var(--spacing-4);
}

.card__footer {
    padding: var(--spacing-4);
    border-top: 1px solid var(--color-gray-200);
    background: var(--color-gray-50);
}

/* Product Card */
.product-card {
    background: white;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    padding: var(--spacing-2);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
}

.product-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card--low-stock {
    border-color: var(--color-warning);
    background: var(--color-warning-bg);
}

.product-card--out-of-stock {
    border-color: var(--color-danger-light);
    background: var(--color-danger-bg);
    opacity: 0.7;
    pointer-events: none;
}
```

### Tables

```css
/* Base Table */
.table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.table th {
    padding: var(--spacing-3);
    text-align: right;
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-gray-700);
    background: var(--color-gray-100);
    border-bottom: 2px solid var(--color-gray-300);
}

.table td {
    padding: var(--spacing-3);
    border-bottom: 1px solid var(--color-gray-200);
    font-size: var(--text-base);
    color: var(--color-gray-800);
}

.table tbody tr:hover {
    background: var(--color-gray-50);
}

/* Table Variants */
.table--striped tbody tr:nth-child(even) {
    background: var(--color-gray-50);
}

.table--compact th,
.table--compact td {
    padding: var(--spacing-2);
    font-size: var(--text-sm);
}
```

### Modals

```css
/* Modal Overlay */
.modal {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal--hidden {
    display: none;
}

/* Modal Content */
.modal__content {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.2s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Modal Parts */
.modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--color-gray-200);
}

.modal__title {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--color-primary);
}

.modal__close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    font-size: 24px;
    color: var(--color-gray-500);
    cursor: pointer;
    border-radius: var(--radius-sm);
}

.modal__close:hover {
    background: var(--color-gray-100);
    color: var(--color-danger);
}

.modal__body {
    padding: var(--spacing-4);
}

.modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-2);
    padding: var(--spacing-4);
    border-top: 1px solid var(--color-gray-200);
    background: var(--color-gray-50);
}
```

### Notifications

```css
/* Notification Container */
.notification-container {
    position: fixed;
    top: var(--spacing-4);
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
}

/* Notification */
.notification {
    background: white;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: var(--spacing-3) var(--spacing-4);
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    min-width: 300px;
    max-width: 450px;
}

/* Notification Variants */
.notification--success {
    border-inline-start: 4px solid var(--color-success);
}

.notification--error {
    border-inline-start: 4px solid var(--color-danger-light);
}

.notification--warning {
    border-inline-start: 4px solid var(--color-warning);
}

.notification--info {
    border-inline-start: 4px solid var(--color-info);
}

.notification__icon {
    font-size: var(--text-xl);
}

.notification__message {
    flex: 1;
    font-size: var(--text-base);
    color: var(--color-gray-800);
}
```

### Badges and Tags

```css
/* Badge */
.badge {
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-1) var(--spacing-2);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-full);
}

.badge--success {
    background: var(--color-success-light);
    color: var(--color-success);
}

.badge--danger {
    background: var(--color-danger-bg);
    color: var(--color-danger-light);
}

.badge--warning {
    background: var(--color-warning-bg);
    color: var(--color-warning);
}

.badge--info {
    background: var(--color-info-bg);
    color: var(--color-info);
}

/* Stock Badge */
.stock-badge {
    font-size: var(--text-xs);
    padding: 2px var(--spacing-2);
    border-radius: var(--radius-full);
    font-weight: var(--font-semibold);
}

.stock-badge--in-stock {
    background: var(--stock-in-stock-bg);
    color: var(--stock-in-stock);
}

.stock-badge--low {
    background: var(--stock-low-bg);
    color: var(--stock-low);
}

.stock-badge--out {
    background: var(--stock-out-bg);
    color: var(--stock-out);
}
```

---

## RTL Layout Guidelines

### Basic RTL Setup

```css
/* HTML Structure */
/* <html lang="ar" dir="rtl"> */

/* Base RTL */
[dir="rtl"] {
    direction: rtl;
    text-align: right;
}

/* LTR for numbers and code */
[dir="rtl"] .ltr-content {
    direction: ltr;
    text-align: left;
}
```

### Logical Properties

```css
/* Use logical properties for RTL support */
.element {
    /* Instead of margin-left/margin-right */
    margin-inline-start: 10px;
    margin-inline-end: 20px;
    
    /* Instead of padding-left/padding-right */
    padding-inline-start: 15px;
    padding-inline-end: 15px;
    
    /* Instead of border-left/border-right */
    border-inline-start: 1px solid #ddd;
    border-inline-end: none;
    
    /* Instead of text-align: left/right */
    text-align: start;
    
    /* Instead of float: left/right */
    float: inline-start;
}

/* Block direction */
.element-block {
    margin-block-start: 10px;
    margin-block-end: 20px;
    padding-block: 15px;
}
```

### Flexbox RTL

```css
/* Flexbox automatically handles RTL */
.flex-container {
    display: flex;
    flex-direction: row; /* Automatically reverses in RTL */
    justify-content: flex-start; /* Starts from right in RTL */
    gap: var(--spacing-2);
}

/* Explicit RTL overrides if needed */
[dir="rtl"] .flex-reverse-on-rtl {
    flex-direction: row-reverse;
}
```

### Grid RTL

```css
/* Grid automatically handles RTL */
.grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-3);
}

/* Items will automatically flow right-to-left */
```

### Position RTL

```css
/* Absolute positioning */
.tooltip {
    position: absolute;
    inset-inline-start: 100%; /* Instead of left/right */
    inset-inline-end: auto;
}

/* Fixed positioning */
[dir="rtl"] .fixed-left {
    left: auto;
    right: 0;
}

[dir="ltr"] .fixed-left {
    left: 0;
    right: auto;
}
```

### Icons in RTL

```css
/* Icons that should flip in RTL */
.icon-directional {
    transition: transform 0.2s;
}

[dir="rtl"] .icon-directional {
    transform: scaleX(-1);
}

/* Icons that should NOT flip */
.icon-non-directional {
    /* No changes needed */
}
```

### Form Elements RTL

```css
/* Input icons */
.input-with-icon {
    position: relative;
}

.input-with-icon input {
    padding-inline-start: var(--spacing-10);
}

.input-with-icon .icon {
    position: absolute;
    inset-inline-start: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
}

/* Checkbox alignment */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
}

[dir="rtl"] .checkbox-label input[type="checkbox"] {
    order: 1;
}
```

### Table RTL

```css
/* Table alignment */
[dir="rtl"] .table th,
[dir="rtl"] .table td {
    text-align: right;
}

/* First/last column styling */
.table th:first-child {
    border-radius: 0 8px 8px 0;
}

[dir="rtl"] .table th:first-child {
    border-radius: 8px 0 0 8px;
}
```

---

## Iconography

### Icon System

This project uses emoji icons for simplicity. Here are the standard icons:

| Icon | Usage |
|------|-------|
| 🔍 | Search |
| ➕ | Add |
| ✏️ | Edit |
| 🗑️ | Delete |
| ✓ | Success/Confirm |
| ✕ | Close/Cancel |
| ⚠ | Warning |
| ℹ | Information |
| 📦 | Product/Package |
| 👤 | User |
| 👥 | Users/Customers |
| 🛒 | Cart |
| 💰 | Money/Sales |
| 💳 | Card Payment |
| 💵 | Cash Payment |
| 📝 | Credit/Note |
| 📊 | Reports/Statistics |
| ⚙️ | Settings |
| 🖨️ | Print |
| 📥 | Import |
| 📤 | Export |
| 🔄 | Refresh |
| ↩️ | Return/Back |

### Icon Usage

```css
/* Icon with text */
.btn-icon-text {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
}

/* Icon only button */
.btn-icon-only {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-lg);
}

/* Icon sizes */
.icon--sm { font-size: var(--text-sm); }
.icon--md { font-size: var(--text-lg); }
.icon--lg { font-size: var(--text-2xl); }
```

---

## Animation and Transitions

### Transition Tokens

```css
:root {
    --transition-fast: 0.1s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;
    
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Common Transitions

```css
/* Hover effect */
.hover-lift {
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Color transition */
.transition-colors {
    transition: background-color var(--transition-normal), 
                color var(--transition-normal), 
                border-color var(--transition-normal);
}

/* Fade in */
.fade-in {
    animation: fadeIn var(--transition-normal);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Slide in */
.slide-in-down {
    animation: slideInDown var(--transition-normal);
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Scale up */
.scale-up {
    animation: scaleUp var(--transition-normal);
}

@keyframes scaleUp {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
```

### Loading States

```css
/* Spinner */
.spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-gray-200);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Progress bar */
.progress-bar {
    height: 8px;
    background: var(--color-gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.progress-bar__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent), var(--color-success));
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
}

/* Skeleton loading */
.skeleton {
    background: linear-gradient(
        90deg,
        var(--color-gray-200) 25%,
        var(--color-gray-100) 50%,
        var(--color-gray-200) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

---

## Responsive Design

### Breakpoints

```css
:root {
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
}

/* Mobile-first media queries */
@media (min-width: 640px) { /* Small devices */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

### Responsive Utilities

```css
/* Hide on specific breakpoints */
.hide-mobile {
    display: none;
}

@media (min-width: 768px) {
    .hide-mobile {
        display: block;
    }
    
    .hide-tablet {
        display: none;
    }
}

@media (min-width: 1024px) {
    .hide-tablet {
        display: block;
    }
    
    .hide-desktop {
        display: none;
    }
}

/* Responsive grid */
.grid-responsive {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-2);
}

@media (min-width: 768px) {
    .grid-responsive {
        grid-template-columns: repeat(4, 1fr);
        gap: var(--spacing-3);
    }
}

@media (min-width: 1024px) {
    .grid-responsive {
        grid-template-columns: repeat(5, 1fr);
        gap: var(--spacing-4);
    }
}
```

### Touch-Friendly Design

```css
/* Larger touch targets for mobile */
@media (max-width: 767px) {
    .btn {
        min-height: 44px;
        min-width: 44px;
    }
    
    .nav-btn {
        padding: var(--spacing-3) var(--spacing-4);
    }
    
    .product-card {
        min-height: 120px;
    }
}

/* Disable hover on touch devices */
@media (hover: none) {
    .hover-lift:hover {
        transform: none;
        box-shadow: none;
    }
}
```

---

*Last Updated: 2024*
*Version: 1.0*
