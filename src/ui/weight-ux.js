
/**
 * Weight-Based UX Patch
 * Injects UI elements and overrides functions to support weight-based products.
 */

console.log('LOADING FRONTEND PATCH for Weight-Based Products...');

// ============================================
// 1. INJECT STYLES & TEMPLATES
// ============================================

const styles = `
<style>
    .weight-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2000;
        justify-content: center;
        align-items: center;
    }
    .weight-modal.active {
        display: flex;
    }
    .weight-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        text-align: center;
    }
    .weight-input-group {
        margin: 15px 0;
    }
    .weight-input-group input {
        width: 100%;
        padding: 10px;
        font-size: 1.2em;
        text-align: center;
    }
    .weight-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }
    .btn-weight {
        padding: 10px 20px;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        font-weight: bold;
    }
    .btn-confirm {
        background: #2ecc71;
        color: white;
    }
    .btn-cancel {
        background: #e74c3c;
        color: white;
    }
    /* Dropdown style fix if needed */
    .form-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
</style>
`;

const modalTemplate = `
<div id="weight-modal" class="weight-modal">
    <div class="weight-content">
        <h3>Enter Weight</h3>
        <p id="weight-product-name"></p>
        <div class="weight-input-group">
            <input type="number" id="weight-input" step="0.001" placeholder="0.000">
            <span>kg</span>
        </div>
        <div class="weight-actions">
            <button class="btn-weight btn-cancel" onclick="closeWeightModal()">Cancel</button>
            <button class="btn-weight btn-confirm" onclick="confirmWeight()">Add to Cart</button>
        </div>
    </div>
</div>
`;

// Inject into DOM
document.head.insertAdjacentHTML('beforeend', styles);
document.body.insertAdjacentHTML('beforeend', modalTemplate);


// ============================================
// 2. OVERRIDE SAVE PRODUCT
// ============================================

// Original function (likely defined in renderer.js)
const originalSaveProduct = window.saveProduct;

// New function
window.saveProduct = async function () {
    console.log('PATCHED saveProduct called');

    // 1. Gather Data (Replicating logic or scraping DOM)
    // We assume standard IDs based on analysis
    const id = document.getElementById('prod-id') ? document.getElementById('prod-id').value : null;
    const name = document.getElementById('prod-name').value;
    const barcode = document.getElementById('prod-barcode').value;
    const price = parseFloat(document.getElementById('prod-price').value) || 0;
    const cost = parseFloat(document.getElementById('prod-cost').value) || 0;
    const stock = parseInt(document.getElementById('prod-stock').value) || 0;
    // ... items like category probably exist too.
    const category = document.getElementById('prod-category') ? document.getElementById('prod-category').value : '';

    // NEW FIELD
    const unitType = document.getElementById('prod-unit-type') ? document.getElementById('prod-unit-type').value : 'unit';
    const unitPrice = parseFloat(document.getElementById('prod-unit-price') ? document.getElementById('prod-unit-price').value : 0);

    // Validate
    if (!name || !barcode) {
        alert('Name and Barcode are required');
        return;
    }

    const productData = {
        name,
        barcode,
        price,
        cost,
        stock,
        category,
        unit_type: unitType,
        unit_price: unitPrice || price // Fallback to price if unit price not set (e.g. for 'unit' type)
    };

    if (id) {
        productData.id = id;
    }

    try {
        await window.api.saveProduct(productData);
        alert('Product Saved!');
        // Refresh?
        if (window.loadProducts) window.loadProducts();

        // Reset form?
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-barcode').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-cost').value = '';
        document.getElementById('prod-stock').value = '';
        if (document.getElementById('prod-id')) document.getElementById('prod-id').value = '';

    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
    }
};

// ============================================
// 3. UI INJECTION (Dropdown)
// ============================================

// We need to inject the "Unit Type" dropdown into the Product Form.
// The form likely exists in DOM.
function injectUnitTypeDropdown() {
    const priceGroup = document.getElementById('prod-price')?.closest('.form-group');
    if (priceGroup && !document.getElementById('prod-unit-type')) {
        const html = `
        <div class="form-group">
            <label>Unit Type</label>
            <select id="prod-unit-type" onchange="toggleUnitPriceField()">
                <option value="unit">Per Unit (Piece)</option>
                <option value="weight">By Weight (kg)</option>
            </select>
        </div>
        <div class="form-group" id="unit-price-group" style="display:none;">
            <label>Price per kg</label>
            <input type="number" id="prod-unit-price" class="form-control" step="0.01">
        </div>
        `;
        priceGroup.insertAdjacentHTML('afterend', html);
    }
}

// Function to toggle unit price input visibility
window.toggleUnitPriceField = function () {
    const type = document.getElementById('prod-unit-type').value;
    const group = document.getElementById('unit-price-group');
    const priceInput = document.getElementById('prod-price');

    if (type === 'weight') {
        group.style.display = 'block';
        // When weight, "Price" input usually becomes "Selling Price" which is calculated?
        // Or we use "Unit Price" AS the price definition.
        // Let's hide the standard "Price" or disable it? 
        // Logic: For weight, Price = Unit Price * Weight.
        // In DB, 'price' col is usually unit price.
        // We map 'prod-unit-price' to 'unit_price' in DB.
        // And 'prod-price' to 'price' (display price? or same?)
        // Backend logic creates both.
    } else {
        group.style.display = 'none';
    }
};

// Run injection when PM section is active or loaded
// For now, run immediately as index.html is loaded.
// Use setTimeout to ensure DOM is ready if script runs early
setTimeout(injectUnitTypeDropdown, 1000);


// ============================================
// 4. OVERRIDE SALES / CART LOGIC
// ============================================

// We need to override addToCart to intercept weight products.
// ID of add button? Usually generated dynamically in `renderProducts`.
// We need to override `renderProducts`?
// OR, we hook into the global `addToCart` function if it exists.

// Assume `addToCart(productId)` exists.
const originalAddToCart = window.addToCart;

let pendingWeightProduct = null;

window.addToCart = async function (productOrId) {
    console.log('PATCHED addToCart called', productOrId);

    let product = productOrId;
    if (typeof productOrId !== 'object') {
        // Fetch product if ID passed (not likely available in global scope easily?)
        // We rely on `window.products` if available, or fetch via API.
        // But `addToCart` in simple POS often takes the object.
        // If it takes ID, how does it get data? from `allProducts` array?
        if (window.allProducts && Array.isArray(window.allProducts)) {
            product = window.allProducts.find(p => p.id == productOrId);
        }
    }

    if (!product) {
        console.error('Product not found for addToCart');
        // Fallback to original if we can't find it to check type
        if (originalAddToCart) originalAddToCart(productOrId);
        return;
    }

    // CHECK UNIT TYPE
    if (product.unit_type === 'weight') {
        // Open Modal
        pendingWeightProduct = product;
        document.getElementById('weight-product-name').innerText = product.name;
        document.getElementById('weight-input').value = '';
        document.getElementById('weight-modal').classList.add('active');
        document.getElementById('weight-input').focus();
    } else {
        // Standard Unit Product -> Call original or existing logic
        // But existing logic might not use `window.cart`.
        // We might need to RE-IMPLEMENT addToCart if we can't invoke original cleanly.
        // Or call `originalAddToCart`?
        // Let's try calling original.
        if (originalAddToCart) {
            originalAddToCart(productOrId);
        } else {
            // Fallback: Implement cart logic
            addCartItem(product, 1);
        }
    }
};

window.closeWeightModal = function () {
    document.getElementById('weight-modal').classList.remove('active');
    pendingWeightProduct = null;
};

window.confirmWeight = function () {
    const weight = parseFloat(document.getElementById('weight-input').value);
    if (!weight || weight <= 0) {
        alert('Please enter a valid weight');
        return;
    }

    if (pendingWeightProduct) {
        addCartItem(pendingWeightProduct, weight);
        closeWeightModal();
    }
};

// Helper: Add to Cart (Re-implementation to support float)
function addCartItem(product, quantity) {
    // Check if cart exists
    if (!window.cart) window.cart = [];

    // Check if item exists (merge)
    const existing = window.cart.find(item => item.product.id === product.id);
    if (existing) {
        existing.quantity += quantity;
        // Round to 3 decimals
        existing.quantity = Math.round(existing.quantity * 1000) / 1000;
        existing.total = existing.quantity * (product.unit_price || product.price);
    } else {
        window.cart.push({
            product: product,
            quantity: quantity,
            price: product.unit_price || product.price,
            name: product.name,
            total: quantity * (product.unit_price || product.price)
        });
    }

    // Update UI
    if (window.renderCart) window.renderCart();
    // Update Total
    if (window.calculateTotal) window.calculateTotal();
}

// Override renderCart to show 'kg'?
// We can simply try to hook into it or assume standard rendering handles text?
// Standard rendering likely shows `x ${item.quantity}`.
// If quantity is decimal, it works.
// But we might want `kg`.
// Let's leave `renderCart` override for now, passing decimal should likely just work visually or we iterate in next step.

console.log('Frontend Patch Loaded.');
