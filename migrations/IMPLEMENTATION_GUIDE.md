# دليل التنفيذ: إضافة دعم نوع الوحدة للمنتجات
## Implementation Guide: Adding Unit Type Support

> **ملاحظة**: نظراً لأن الملفات الأصلية مشفرة (obfuscated), يُرجى اتباع هذا الدليل لتطبيق التغييرات على النسخة الأصلية غير المشفرة من الكود.

---

## المتطلبات الأساسية (Prerequisites)

### ✅ قبل البدء:
1. نسخة احتياطية من قاعدة البيانات
   ```bash
   cp pos.db pos.db.backup-$(date +%Y%m%d)
   ```

2. الوصول إلى الكود المصدري غير المشفر

3. بيئة التطوير جاهزة:
   ```bash
   npm install
   ```

---

## خطوات التنفيذ (Implementation Steps)

### المرحلة 1: تحديث قاعدة البيانات (Database Schema)

#### 1.1 فتح ملف `src/database.js`

ابحث عن دالة `initDB()` أو القسم المسؤول عن تهيئة قاعدة البيانات.

#### 1.2 إضافة الأعمدة الجديدة

أضف الكود التالي **بعد** جميع أوامر `CREATE TABLE` وقبل نهاية الدالة:

```javascript
// إضافة حقل نوع الوحدة (Add unit_type column)
try {
    db.prepare(`
        ALTER TABLE products 
        ADD COLUMN unit_type TEXT DEFAULT 'unit'
    `).run();
    console.log('✓ تم إضافة حقل unit_type');
} catch (error) {
    // العمود موجود بالفعل
    console.log('unit_type موجود بالفعل');
}

// إضافة حقل سعر الوحدة (Add unit_price column)
try {
    db.prepare(`
        ALTER TABLE products 
        ADD COLUMN unit_price REAL DEFAULT 0
    `).run();
    console.log('✓ تم إضافة حقل unit_price');
} catch (error) {
    // العمود موجود بالفعل
    console.log('unit_price موجود بالفعل');
}
```

**الموقع في الملف**: 
- ابحث عن `CREATE TABLE IF NOT EXISTS products`
- أضف الكود بعد جميع أوامر CREATE TABLE

**مرجع**: `migrations/database_modifications_reference.js`

---

### المرحلة 2: تحديث معالجات IPC (Backend IPC Handlers)

#### 2.1 فتح ملف `src/main.js`

#### 2.2 تحديث `products:create` Handler

ابحث عن:
```javascript
ipcMain.handle('products:create', async (event, productData) => {
```

قم بتحديثها لتضمين الحقول الجديدة:

```javascript
ipcMain.handle('products:create', async (event, productData) => {
    try {
        const {
            name,
            barcode,
            price,
            cost = 0,
            stock = 0,
            category,
            supplier_id,
            low_stock_limit = 0,
            description,
            unit_type = 'unit',      // ← إضافة جديدة
            unit_price = 0,          // ← إضافة جديدة
        } = productData;

        // التحقق من صحة البيانات
        if (!['unit', 'weight'].includes(unit_type)) {
            throw new Error('نوع الوحدة غير صالح');
        }

        // تحديث الاستعلام SQL
        const stmt = db.prepare(`
            INSERT INTO products (
                name, barcode, price, cost, stock, 
                category, supplier_id, low_stock_limit, 
                description, unit_type, unit_price
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            name, barcode, price, cost, stock,
            category, supplier_id, low_stock_limit,
            description, unit_type, unit_price
        );

        return { success: true, product: { id: result.lastInsertRowid, ...productData } };
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
});
```

#### 2.3 تحديث `products:update` Handler

أضف `unit_type` و `unit_price` للحقول المسموح بتحديثها:

```javascript
const allowedFields = [
    'name', 'barcode', 'price', 'cost', 'stock',
    'category', 'supplier_id', 'low_stock_limit',
    'description', 'unit_type', 'unit_price'  // ← إضافة جديدة
];
```

#### 2.4 تحديث `products:search` و `products:get` Handlers

أضف الحقول الجديدة في استعلامات SELECT:

```javascript
SELECT 
    id, name, barcode, price, cost, stock,
    category, supplier_id, low_stock_limit,
    description, unit_type, unit_price  -- ← إضافة جديدة
FROM products
WHERE ...
```

**مرجع**: `migrations/ipc_handlers_reference.js`

---

### المرحلة 3: تحديث واجهة المستخدم (Frontend UI)

#### 3.1 فتح ملف `src/ui/index.html`

#### 3.2 إضافة حقول النموذج

ابحث عن نموذج إضافة/تعديل المنتج وأضف الحقول التالية بعد حقل السعر:

```html
<!-- نوع البيع -->
<div class="form-group">
  <label for="product-unit-type">
    <i class="fas fa-balance-scale"></i>
    نوع البيع
    <span class="required">*</span>
  </label>
  <select id="product-unit-type" class="form-control" required>
    <option value="unit" selected>وحدة (قطعة)</option>
    <option value="weight">وزن (كيلو/جرام)</option>
  </select>
</div>

<!-- سعر الوحدة -->
<div class="form-group">
  <label for="product-unit-price">
    <i class="fas fa-tag"></i>
    سعر الوحدة
    <span class="required">*</span>
  </label>
  <div class="input-group">
    <input 
      type="number" 
      id="product-unit-price" 
      class="form-control" 
      step="0.01" 
      min="0" 
      required
    >
    <div class="input-group-append">
      <span class="input-group-text" id="unit-price-label">ر.س/قطعة</span>
    </div>
  </div>
</div>
```

**مرجع**: `migrations/html_modifications_reference.html`

---

#### 3.3 فتح ملف `src/ui/renderer.js`

#### 3.4 إضافة دوال المساعدة (Helper Functions)

أضف هذه الدوال في بداية الملف أو قسم الأدوات المساعدة:

```javascript
// تنسيق عرض السعر
function formatProductPrice(product) {
    const price = parseFloat(product.unit_price || 0).toFixed(2);
    const unitLabel = product.unit_type === 'weight' ? 'كيلو' : 'قطعة';
    return `${price} ر.س / ${unitLabel}`;
}

// الحصول على تسمية الوحدة
function getUnitLabel(unitType) {
    return unitType === 'weight' ? 'كيلو' : 'قطعة';
}

// أيقونة الوحدة
function getUnitIcon(unitType) {
    return unitType === 'weight' ? '⚖️' : '📦';
}

// التحقق من صحة الكمية
function validateQuantity(quantity, unitType) {
    if (isNaN(quantity) || quantity <= 0) {
        return false;
    }
    // للمنتجات بالوحدة، الكمية يجب أن تكون عدد صحيح
    if (unitType === 'unit' && !Number.isInteger(parseFloat(quantity))) {
        return false;
    }
    return true;
}
```

#### 3.5 تحديث دالة حفظ المنتج

ابحث عن `saveProduct()` أو `createProduct()` وأضف الحقول الجديدة:

```javascript
async function saveProduct() {
    const productData = {
        name: document.getElementById('product-name')?.value,
        barcode: document.getElementById('product-barcode')?.value,
        price: parseFloat(document.getElementById('product-price')?.value || 0),
        cost: parseFloat(document.getElementById('product-cost')?.value || 0),
        stock: parseInt(document.getElementById('product-stock')?.value || 0),
        category: document.getElementById('product-category')?.value,
        description: document.getElementById('product-description')?.value,
        
        // الحقول الجديدة
        unit_type: document.getElementById('product-unit-type')?.value || 'unit',
        unit_price: parseFloat(document.getElementById('product-unit-price')?.value || 0),
    };

    // التحقق من صحة البيانات
    if (!['unit', 'weight'].includes(productData.unit_type)) {
        showError('نوع الوحدة غير صالح');
        return;
    }

    try {
        const result = await window.api.invoke('products:create', productData);
        if (result.success) {
            showSuccess('تم إضافة المنتج بنجاح');
            resetProductForm();
            refreshProductList();
        }
    } catch (error) {
        showError('حدث خطأ: ' + error.message);
    }
}
```

#### 3.6 تحديث دالة عرض المنتجات

قم بتحديث `displayProduct()` لإظهار نوع الوحدة والسعر:

```javascript
function displayProduct(product) {
    const unitBadge = `
        <span class="badge badge-${product.unit_type === 'weight' ? 'info' : 'primary'}">
            ${getUnitIcon(product.unit_type)} ${getUnitLabel(product.unit_type)}
        </span>
    `;
    
    const priceDisplay = formatProductPrice(product);
    
    return `
        <div class="product-card">
            <h5>${product.name} ${unitBadge}</h5>
            <p class="price">${priceDisplay}</p>
            <p class="stock">المخزون: ${product.stock} ${getUnitLabel(product.unit_type)}</p>
            <!-- باقي الكود -->
        </div>
    `;
}
```

#### 3.7 تحديث دالة إضافة للسلة

قم بتحديث `addToCart()` لدعم الأرقام العشرية للمنتجات بالوزن:

```javascript
async function addToCart(productId) {
    const result = await window.api.invoke('products:get', { id: productId });
    const product = result.product;
    
    // عرض حقل الكمية بناءً على نوع الوحدة
    const quantity = await promptQuantity(product);
    
    // التحقق من الكمية
    if (!validateQuantity(quantity, product.unit_type)) {
        if (product.unit_type === 'unit') {
            showError('الكمية يجب أن تكون عدد صحيح');
        } else {
            showError('الكمية غير صالحة');
        }
        return;
    }
    
    // إضافة للسلة
    const cartItem = {
        productId: product.id,
        productName: product.name,
        unitType: product.unit_type,
        unitPrice: product.unit_price,
        quantity: quantity,
        totalPrice: quantity * product.unit_price,
    };
    
    addItemToCart(cartItem);
    showSuccess(`تم إضافة ${quantity} ${getUnitLabel(product.unit_type)} إلى السلة`);
}
```

#### 3.8 إضافة Event Listener لتحديث تسمية السعر

أضف في `DOMContentLoaded`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const unitTypeSelect = document.getElementById('product-unit-type');
    const unitPriceLabel = document.getElementById('unit-price-label');
    
    if (unitTypeSelect && unitPriceLabel) {
        unitTypeSelect.addEventListener('change', function() {
            unitPriceLabel.textContent = this.value === 'weight' ? 'ر.س/كيلو' : 'ر.س/قطعة';
        });
    }
});
```

**مرجع**: `migrations/renderer_modifications_reference.js`

---

### المرحلة 4: تحديث التوثيق (Documentation)

راجع الملفات التالية وقم بتحديثها:

1. **`docs/API_IPC_AR.md`**: إضافة أمثلة للحقول الجديدة
2. **`docs/USER_GUIDE_AR.md`**: إضافة دليل للمنتجات بالوزن والوحدة

---

## التحقق والاختبار (Verification & Testing)

### 1. تحقق من قاعدة البيانات

```bash
# افتح قاعدة البيانات
sqlite3 pos.db

# تحقق من الأعمدة الجديدة
PRAGMA table_info(products);

# يجب أن ترى:
# unit_type | TEXT | 0 | 'unit' | 0
# unit_price | REAL | 0 | 0 | 0
```

### 2. اختبر Backend

افتح DevTools (F12) واختبر:

```javascript
// اختبار إضافة منتج بالوحدة
const product1 = await window.api.invoke('products:create', {
    name: 'قلم رصاص',
    unit_type: 'unit',
    unit_price: 2.5,
    stock: 100
});
console.log('Product created:', product1);

// اختبار إضافة منتج بالوزن
const product2 = await window.api.invoke('products:create', {
    name: 'رز بسمتي',
    unit_type: 'weight',
    unit_price: 12.5,
    stock: 50
});
console.log('Product created:', product2);
```

### 3. اختبر Frontend

1. افتح نموذج إضافة منتج
2. تحقق من وجود حقل "نوع البيع"
3. تحقق من وجود حقل "سعر الوحدة"
4. أضف منتج بكل نوع
5. تحقق من العرض الصحيح في القائمة
6. اختبر إضافة المنتجات للسلة:
   - منتج بالوحدة: الكمية عدد صحيح فقط
   - منتج بالوزن: الكمية بأرقام عشرية

### 4. اختبر الطباعة

اطبع فاتورة تحتوي على:
- منتج بالوحدة (قطعة)
- منتج بالوزن (كيلو)

تأكد من العرض الصحيح للوحدات والأسعار.

---

## استكشاف الأخطاء (Troubleshooting)

### المشكلة: لا تظهر الحقول الجديدة في قاعدة البيانات

**الحل**:
```javascript
// تشغيل الأوامر يدوياً
db.prepare('ALTER TABLE products ADD COLUMN unit_type TEXT DEFAULT "unit"').run();
db.prepare('ALTER TABLE products ADD COLUMN unit_price REAL DEFAULT 0').run();
```

### المشكلة: خطأ في إضافة منتج

**التحقق من**:
- صحة قيم `unit_type` (يجب أن تكون 'unit' أو 'weight')
- `unit_price` رقم صحيح وأكبر من أو يساوي 0

### المشكلة: الكمية في السلة لا تقبل أرقام عشرية

**التحقق من**:
- حقل الكمية يحتوي على `step="0.01"` للمنتجات بالوزن
- دالة `validateQuantity()` تعمل بشكل صحيح

---

## الملفات المرجعية (Reference Files)

تم إنشاء الملفات التالية لمساعدتك:

| الملف | الوصف |
|------|-------|
| `migrations/migration_add_unit_type.sql` | ملف SQL للتنفيذ اليدوي |
| `migrations/database_modifications_reference.js` | مرجع لتعديلات database.js |
| `migrations/ipc_handlers_reference.js` | مرجع لتعديلات main.js |
| `migrations/html_modifications_reference.html` | مرجع لتعديلات index.html |
| `migrations/renderer_modifications_reference.js` | مرجع لتعديلات renderer.js |

---

## ملاحظات نهائية

### ⚠️ تحذيرات

1. **النسخ الاحتياطي**: احرص على عمل نسخة احتياطية من قاعدة البيانات قبل التطبيق
2. **التوافق**: تأكد من تحديث جميع الأجزاء معاً (Backend + Frontend)
3. **الاختبار**: اختبر جميع الوظائف قبل النشر للإنتاج

### ✅ الخطوات التالية

1. تطبيق التغييرات على الكود المصدري
2. اختبار شامل في بيئة التطوير
3. تحديث التوثيق
4. النشر التدريجي للإنتاج

---

**إذا واجهت أي مشاكل، راجع المرجع الكامل في مجلد `migrations/`**
