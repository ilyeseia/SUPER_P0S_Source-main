# تحديثات API - دعم نوع الوحدة للمنتجات
# API Updates - Product Unit Type Support

> **إضافة لملف**: `docs/API_IPC_AR.md`

---

## 📦 إدارة المنتجات - التحديثات

### الحقول الجديدة في كائن المنتج

تمت إضافة حقلين جديدين لجميع عمليات المنتجات:

| الحقل | النوع | القيمة الافتراضية | الوصف |
|-------|------|-------------------|-------|
| `unit_type` | String | `'unit'` | نوع البيع: `'unit'` (وحدة/قطعة) أو `'weight'` (وزن/كيلو) |
| `unit_price` | Number | `0` | السعر لكل وحدة أو كيلو حسب نوع البيع |

---

### `products:create`

إنشاء منتج جديد مع دعم نوع الوحدة.

#### المعاملات المُحدثة:

```javascript
{
  name: String,           // اسم المنتج (مطلوب)
  barcode: String,        // الباركود
  price: Number,          // السعر
  cost: Number,           // التكلفة
  stock: Number,          // المخزون
  category: String,       // الفئة
  unit_type: String,      // نوع البيع: 'unit' أو 'weight' (افتراضي: 'unit')
  unit_price: Number,     // سعر الوحدة/الكيلو (افتراضي: 0)
  // ... حقول أخرى
}
```

#### أمثلة:

**منتج بالوحدة (قطعة):**
```javascript
const product = await window.api.invoke('products:create', {
  name: 'قلم رصاص',
  barcode: '7891234567890',
  price: 2.50,
  cost: 1.50,
  stock: 100,
  category: 'قرطاسية',
  unit_type: 'unit',      // يُباع بالقطعة
  unit_price: 2.50        // 2.50 ر.س لكل قطعة
});

console.log('Product created:', product);
// {
//   success: true,
//   product: {
//     id: 123,
//     name: 'قلم رصاص',
//     unit_type: 'unit',
//     unit_price: 2.50,
//     ...
//   }
// }
```

**منتج بالوزن (كيلو):**
```javascript
const product = await window.api.invoke('products:create', {
  name: 'رز بسمتي',
  barcode: '9876543210123',
  price: 12.50,
  cost: 8.00,
  stock: 50,
  category: 'حبوب',
  unit_type: 'weight',    // يُباع بالوزن
  unit_price: 12.50       // 12.50 ر.س لكل كيلو
});

console.log('Product created:', product);
```

---

### `products:update`

تحديث معلومات منتج موجود.

#### التحديثات المتاحة:

جميع الحقول قابلة للتحديث، بما في ذلك `unit_type` و `unit_price`.

#### أمثلة:

**تغيير منتج من وحدة إلى وزن:**
```javascript
await window.api.invoke('products:update', {
  id: 15,
  data: {
    unit_type: 'weight',   // تغيير من 'unit' إلى 'weight'
    unit_price: 25.50      // تحديث السعر لكل كيلو
  }
});
```

**تحديث سعر الوحدة فقط:**
```javascript
await window.api.invoke('products:update', {
  id: 20,
  data: {
    unit_price: 3.75       // تحديث السعر فقط
  }
});
```

**تحديث متعدد للحقول:**
```javascript
await window.api.invoke('products:update', {
  id: 30,
  data: {
    name: 'سكر أبيض',
    unit_type: 'weight',
    unit_price: 8.50,
    stock: 75
  }
});
```

---

### `products:search`

البحث عن المنتجات مع إرجاع الحقول الجديدة.

#### الاستجابة المُحدثة:

```javascript
const products = await window.api.invoke('products:search', {
  query: 'قهوة',
  inStock: true
});

console.log(products);
// {
//   success: true,
//   products: [
//     {
//       id: 15,
//       name: 'قهوة عربية',
//       barcode: '1234567890',
//       price: 49.99,
//       cost: 35.00,
//       stock: 150,
//       category: 'مشروبات',
//       unit_type: 'weight',    // النوع الجديد
//       unit_price: 49.99       // السعر الجديد
//     },
//     {
//       id: 16,
//       name: 'قهوة تركية',
//       barcode: '0987654321',
//       price: 15.00,
//       cost: 10.00,  
//       stock: 200,
//       category: 'مشروبات',
//       unit_type: 'unit',      // يُباع بالقطعة
//       unit_price: 15.00
//     }
//   ]
// }
```

---

### `products:get`

الحصول على منتج واحد بواسطة المعرف.

#### مثال الاستجابة:

```javascript
const product = await window.api.invoke('products:get', { id: 42 });

console.log(product);
// {
//   success: true,
//   product: {
//     id: 42,
//     name: 'دقيق أبيض',
//     barcode: '5432167890',
//     price: 18.00,
//     cost: 12.00,
//     stock: 80,
//     category: 'مخبوزات',
//     supplier_id: 5,
//     low_stock_limit: 10,
//     description: 'دقيق فاخر للخبز',
//     unit_type: 'weight',      // يُباع بالوزن
//     unit_price: 18.00         // 18 ر.س لكل كيلو
//   }
// }
```

---

## 🔍 التحقق من الصحة (Validation)

### قيود `unit_type`

- **القيم المسموحة**: `'unit'` أو `'weight'` فقط
- **القيمة الافتراضية**: `'unit'`
- إدخال قيمة غير صحيحة سيؤدي لخطأ:

```javascript
try {
  await window.api.invoke('products:create', {
    name: 'منتج اختبار',
    unit_type: 'invalid'  // ❌ قيمة غير صحيحة
  });
} catch (error) {
  console.error(error.message);
  // "Invalid unit_type. Must be 'unit' or 'weight'"
}
```

### قيود `unit_price`

- **النوع**: Number (رقم)
- **القيمة الدنيا**: 0
- **القيمة الافتراضية**: 0
- يجب أن يكون رقم موجب أو صفر:

```javascript
try {
  await window.api.invoke('products:create', {
    name: 'منتج اختبار',
    unit_price: -5.00  // ❌ قيمة سالبة غير مسموحة
  });
} catch (error) {
  console.error(error.message);
  // "Invalid unit_price. Must be a positive number"
}
```

---

## 💡 أفضل الممارسات (Best Practices)

### 1. تحديد نوع الوحدة بوضوح

```javascript
// ✅ جيد - نوع الوحدة واضح
const riceProduct = {
  name: 'رز بسمتي',
  unit_type: 'weight',
  unit_price: 12.50
};

const penProduct = {
  name: 'قلم حبر',
  unit_type: 'unit',
  unit_price: 3.25
};
```

### 2. مزامنة السعر مع نوع الوحدة

عند تغيير `unit_type`, تأكد من تحديث `unit_price` بشكل مناسب:

```javascript
// ✅ جيد - تحديث كلا الحقلين معاً
await window.api.invoke('products:update', {
  id: 50,
  data: {
    unit_type: 'weight',  // تغيير من وحدة إلى وزن
    unit_price: 20.00     // تحديث السعر وفقاً للوزن
  }
});
```

### 3. التعامل مع المنتجات القديمة

المنتجات القديمة (قبل التحديث) ستحتوي على:
- `unit_type: 'unit'`
- `unit_price: 0`

يُنصح بمراجعة وتحديث هذه القيم:

```javascript
// الحصول على جميع المنتجات بـ unit_price = 0
const oldProducts = await window.api.invoke('products:search', {});

const productsToUpdate = oldProducts.products.filter(p => p.unit_price === 0);

// تحديث كل منتج
for (const product of productsToUpdate) {
  await window.api.invoke('products:update', {
    id: product.id,
    data: {
      unit_price: product.price,  // استخدام السعر الحالي كسعر وحدة
      // تحديد نوع الوحدة يدوياً حسب المنتج
      unit_type: product.name.includes('كيلو') ? 'weight' : 'unit'
    }
  });
}
```

---

## 📊 أمثلة شاملة

### سيناريو كامل: إضافة وبيع منتج بالوزن

```javascript
// 1. إنشاء منتج جديد بالوزن
const product = await window.api.invoke('products:create', {
  name: 'سكر أبيض',
  barcode: '1111222233334',
  price: 7.50,
  cost: 5.00,
  stock: 100,
  category: 'بقالة',
  unit_type: 'weight',
  unit_price: 7.50
});

console.log('Product ID:', product.product.id);

// 2. إنشاء عملية بيع بكمية عشرية (2.5 كيلو)
const sale = await window.api.invoke('sales:create', {
  items: [
    {
      productId: product.product.id,
      productName: 'سكر أبيض',
      quantity: 2.5,          // 2.5 كيلو (رقم عشري)
      price: 7.50,
      totalPrice: 18.75       // 2.5 × 7.50 = 18.75
    }
  ],
  paymentMethod: 'cash',
  totalAmount: 18.75
});

console.log('Sale completed:', sale);

// 3. التحقق من المخزون المُحدث
const updatedProduct = await window.api.invoke('products:get', {
  id: product.product.id
});

console.log('Remaining stock:', updatedProduct.product.stock);
// 97.5 كيلو (100 - 2.5)
```

---

## 🔄 الترحيل من النظام القديم

للمطورين الذين لديهم بيانات موجودة:

```javascript
// سكريبت بسيط لترحيل المنتجات القديمة
async function migrateOldProducts() {
  const products = await window.api.invoke('products:search', {});
  
  for (const product of products.products) {
    // تحديد نوع الوحدة بناءً على اسم المنتج أو الفئة
    let unitType = 'unit';
    const weightKeywords = ['كيلو', 'جرام', 'رز', 'سكر', 'دقيق', 'قهوة'];
    
    if (weightKeywords.some(keyword => product.name.includes(keyword))) {
      unitType = 'weight';
    }
    
    // تحديث المنتج
    await window.api.invoke('products:update', {
      id: product.id,
      data: {
        unit_type: unitType,
        unit_price: product.price || 0
      }
    });
    
    console.log(`Updated product ${product.id}: ${product.name} (${unitType})`);
  }
  
  console.log('Migration completed!');
}

// تنفيذ الترحيل
await migrateOldProducts();
```

---

**تاريخ التحديث**: 2026-02-09  
**الإصدار**: 2.0.5+ (يتطلب دعم unit_type)

---

**للمزيد من المعلومات، راجع:**
- [دليل التنفيذ](../migrations/IMPLEMENTATION_GUIDE.md)
- [مرجع IPC Handlers](../migrations/ipc_handlers_reference.js)
