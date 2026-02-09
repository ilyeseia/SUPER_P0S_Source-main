/**
 * Renderer JavaScript Reference - renderer.js modifications
 * 
 * Add these functions and update existing ones to support unit_type and unit_price
 * Look for product-related functions in renderer.js
 */

// ==============================================================================
// Helper Functions - Add these to renderer.js
// ==============================================================================

/**
 * Format product price display based on unit type
 * @param {Object} product - Product object with unit_type and unit_price
 * @returns {string} Formatted price string
 */
function formatProductPrice(product) {
    const price = parseFloat(product.unit_price || 0).toFixed(2);
    const unitLabel = product.unit_type === 'weight' ? 'كيلو' : 'قطعة';
    return `${price} ر.س / ${unitLabel}`;
}

/**
 * Get unit label for product based on unit type
 * @param {string} unitType - 'unit' or 'weight'
 * @returns {string} Unit label in Arabic
 */
function getUnitLabel(unitType) {
    return unitType === 'weight' ? 'كيلو' : 'قطعة';
}

/**
 * Get unit icon/emoji for product based on unit type
 * @param {string} unitType - 'unit' or 'weight'
 * @returns {string} Icon/emoji
 */
function getUnitIcon(unitType) {
    return unitType === 'weight' ? '⚖️' : '📦';
}

/**
 * Validate quantity based on product unit type
 * @param {number} quantity - Quantity to validate
 * @param {string} unitType - 'unit' or 'weight'
 * @returns {boolean} True if valid
 */
function validateQuantity(quantity, unitType) {
    if (isNaN(quantity) || quantity <= 0) {
        return false;
    }

    // For unit-based products, quantity must be integer
    if (unitType === 'unit' && !Number.isInteger(parseFloat(quantity))) {
        return false;
    }

    return true;
}

// ==============================================================================
// Update Product Form Submission Handler
// ==============================================================================

/**
 * Modify the existing saveProduct() or createProduct() function
 * to include unit_type and unit_price fields
 */

async function saveProduct() {
    try {
        // Get form values
        const productData = {
            name: document.getElementById('product-name')?.value,
            barcode: document.getElementById('product-barcode')?.value,
            price: parseFloat(document.getElementById('product-price')?.value || 0),
            cost: parseFloat(document.getElementById('product-cost')?.value || 0),
            stock: parseInt(document.getElementById('product-stock')?.value || 0),
            category: document.getElementById('product-category')?.value,
            description: document.getElementById('product-description')?.value,

            // NEW FIELDS
            unit_type: document.getElementById('product-unit-type')?.value || 'unit',
            unit_price: parseFloat(document.getElementById('product-unit-price')?.value || 0),
        };

        // Validation
        if (!productData.name) {
            showError('الرجاء إدخال اسم المنتج');
            return;
        }

        if (!['unit', 'weight'].includes(productData.unit_type)) {
            showError('نوع الوحدة غير صالح');
            return;
        }

        if (productData.unit_price < 0) {
            showError('سعر الوحدة يجب أن يكون أكبر من أو يساوي صفر');
            return;
        }

        // Send to backend via IPC
        const result = await window.api.invoke('products:create', productData);

        if (result.success) {
            showSuccess('تم إضافة المنتج بنجاح');
            resetProductForm();
            refreshProductList();
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showError('حدث خطأ أثناء حفظ المنتج: ' + error.message);
    }
}

// ==============================================================================
// Update Product Display Function
// ==============================================================================

/**
 * Modify the function that displays products in the UI
 * to show unit type and unit price
 */

function displayProduct(product) {
    const unitBadge = `
        <span class="badge badge-${product.unit_type === 'weight' ? 'info' : 'primary'}">
            ${getUnitIcon(product.unit_type)} ${getUnitLabel(product.unit_type)}
        </span>
    `;

    const priceDisplay = formatProductPrice(product);

    // Example product card HTML
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-header">
                <h5>${product.name}</h5>
                ${unitBadge}
            </div>
            <div class="product-body">
                <p class="price">${priceDisplay}</p>
                <p class="stock">
                    المخزون: ${product.stock} ${getUnitLabel(product.unit_type)}
                </p>
                ${product.barcode ? `<p class="barcode">الباركود: ${product.barcode}</p>` : ''}
            </div>
            <div class="product-actions">
                <button onclick="addToCart(${product.id})" class="btn btn-success">
                    إضافة للسلة
                </button>
                <button onclick="editProduct(${product.id})" class="btn btn-primary">
                    تعديل
                </button>
            </div>
        </div>
    `;
}

// ==============================================================================
// Update Add to Cart Function
// ==============================================================================

/**
 * Modify the addToCart() function to handle different unit types
 */

async function addToCart(productId) {
    try {
        // Get product details
        const result = await window.api.invoke('products:get', { id: productId });

        if (!result.success) {
            showError('المنتج غير موجود');
            return;
        }

        const product = result.product;

        // Show quantity input dialog
        const quantity = await promptQuantity(product);

        if (!quantity) {
            return; // User cancelled
        }

        // Validate quantity based on unit type
        if (!validateQuantity(quantity, product.unit_type)) {
            if (product.unit_type === 'unit') {
                showError('الكمية يجب أن تكون عدد صحيح للمنتجات بالوحدة');
            } else {
                showError('الكمية غير صالحة');
            }
            return;
        }

        // Calculate total price
        const totalPrice = quantity * product.unit_price;

        // Add to cart
        const cartItem = {
            productId: product.id,
            productName: product.name,
            unitType: product.unit_type,
            unitPrice: product.unit_price,
            quantity: quantity,
            totalPrice: totalPrice,
        };

        addItemToCart(cartItem);
        updateCartDisplay();
        showSuccess(
            `تم إضافة ${quantity} ${getUnitLabel(product.unit_type)} إلى السلة`
        );

    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('حدث خطأ أثناء إضافة المنتج للسلة');
    }
}

// ==============================================================================
// Quantity Input Dialog for Different Unit Types
// ==============================================================================

/**
 * Show quantity input dialog with appropriate settings based on unit type
 * @param {Object} product - Product object
 * @returns {Promise<number|null>} Quantity or null if cancelled
 */
function promptQuantity(product) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">إدخال الكمية</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>المنتج: <strong>${product.name}</strong></p>
                        <p>
                            ${getUnitIcon(product.unit_type)} 
                            ${getUnitLabel(product.unit_type)}
                        </p>
                        <div class="form-group">
                            <label>الكمية:</label>
                            <input 
                                type="number" 
                                id="quantity-input"
                                class="form-control"
                                step="${product.unit_type === 'weight' ? '0.01' : '1'}"
                                min="${product.unit_type === 'weight' ? '0.01' : '1'}"
                                value="1"
                                placeholder="${product.unit_type === 'weight' ? 'مثال: 1.5' : 'مثال: 5'}"
                                autofocus
                            >
                            <small class="form-text text-muted">
                                ${product.unit_type === 'weight'
                ? 'يمكنك إدخال أرقام عشرية (مثال: 1.5, 2.25)'
                : 'أدخل عدد صحيح فقط'}
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            إلغاء
                        </button>
                        <button type="button" class="btn btn-primary" id="confirm-quantity">
                            تأكيد
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize modal (Bootstrap or custom)
        $(modal).modal('show');

        // Handle confirm
        document.getElementById('confirm-quantity').addEventListener('click', () => {
            const quantity = parseFloat(document.getElementById('quantity-input').value);
            $(modal).modal('hide');
            modal.remove();
            resolve(quantity);
        });

        // Handle cancel/close
        $(modal).on('hidden.bs.modal', () => {
            modal.remove();
            resolve(null);
        });
    });
}

// ==============================================================================
// Update Cart Display Function
// ==============================================================================

/**
 * Update the cart display to show unit types correctly
 */

function displayCartItem(cartItem) {
    return `
        <tr class="cart-item" data-item-id="${cartItem.productId}">
            <td>
                ${cartItem.productName}
                <small class="text-muted">
                    ${getUnitIcon(cartItem.unitType)} ${getUnitLabel(cartItem.unitType)}
                </small>
            </td>
            <td>${cartItem.unitPrice.toFixed(2)} ر.س</td>
            <td>
                ${cartItem.quantity} ${getUnitLabel(cartItem.unitType)}
            </td>
            <td>${cartItem.totalPrice.toFixed(2)} ر.س</td>
            <td>
                <button onclick="removeFromCart('${cartItem.productId}')" 
                        class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// ==============================================================================
// Event Listeners - Add to DOMContentLoaded
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Update unit price label when unit type changes
    const unitTypeSelect = document.getElementById('product-unit-type');
    const unitPriceLabel = document.getElementById('unit-price-label');

    if (unitTypeSelect && unitPriceLabel) {
        unitTypeSelect.addEventListener('change', function () {
            const unitType = this.value;
            unitPriceLabel.textContent = unitType === 'weight' ? 'ر.س/كيلو' : 'ر.س/قطعة';
        });
    }

    // Other initialization code...
});

// ==============================================================================
// Location in renderer.js
// ==============================================================================

/**
 * Look for these existing functions and update them:
 * - saveProduct() or createProduct()
 * - displayProduct() or renderProduct()
 * - addToCart()
 * - displayCartItem() or renderCartItem()
 * 
 * Add the new helper functions at the top of the file or in a utilities section
 */
