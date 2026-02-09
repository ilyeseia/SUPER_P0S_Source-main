# مرجع API - اتصالات IPC

## نظرة عامة

يستخدم ULTRA_POS نظام IPC (الاتصال بين العمليات) في Electron للاتصال الآمن بين العملية الرئيسية (الخلفية) وعملية العرض (الواجهة الأمامية).

## بنية IPC

```
┌─────────────────┐         IPC         ┌─────────────────┐
│                 │◄──────────────────►│                 │
│   Renderer      │    invoke/handle    │   Main Process  │
│   Process       │      send/on        │                 │
│   (الواجهة)     │                     │   (الخلفية)     │
└─────────────────┘                     └─────────────────┘
```

---

## قنوات IPC المتاحة

### 📊 إدارة المبيعات

#### `sales:create`

إنشاء عملية بيع جديدة.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| items | Array | نعم | قائمة المنتجات المباعة |
| customer | Object | لا | معلومات العميل |
| paymentMethod | String | نعم | طريقة الدفع |
| discount | Number | لا | الخصم المطبق |

**الاستجابة:**
- 200: كائن البيع مع المعرف
- 400: بيانات غير صالحة
- 500: خطأ داخلي

**مثال:**
```javascript
// الواجهة الأمامية (renderer.js)
const saleData = {
  items: [
    { productId: 1, quantity: 2, price: 15.99 },
    { productId: 3, quantity: 1, price: 29.99 }
  ],
  customer: { id: 123, name: 'أحمد محمد' },
  paymentMethod: 'cash',
  discount: 5.00
};

const result = await window.api.invoke('sales:create', saleData);
console.log('تم إنشاء البيع:', result);
```

#### `sales:get`

استرجاع عملية بيع بواسطة المعرف.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| id | Number | نعم | معرف البيع |

**الاستجابة:**
- 200: كائن البيع
- 404: البيع غير موجود

**مثال:**
```javascript
const sale = await window.api.invoke('sales:get', { id: 42 });
```

#### `sales:list`

سرد المبيعات مع الفلاتر.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| startDate | String | لا | تاريخ البداية (ISO) |
| endDate | String | لا | تاريخ النهاية (ISO) |
| limit | Number | لا | الحد الأقصى للنتائج |
| offset | Number | لا | الترقيم |

**مثال:**
```javascript
const sales = await window.api.invoke('sales:list', {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  limit: 50,
  offset: 0
});
```

---

### 📦 إدارة المنتجات

#### `products:search`

البحث عن المنتجات.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| query | String | نعم | مصطلح البحث |
| category | String | لا | الفلترة حسب الفئة |
| inStock | Boolean | لا | المتوفر فقط |

**مثال:**
```javascript
const products = await window.api.invoke('products:search', {
  query: 'قهوة',
  inStock: true
});
```

#### `products:update`

تحديث منتج.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| id | Number | نعم | معرف المنتج |
| data | Object | نعم | البيانات للتحديث |

**مثال:**
```javascript
await window.api.invoke('products:update', {
  id: 15,
  data: {
    price: 19.99,
    stock: 150
  }
});
```

---

### 🖨️ خدمات الطباعة

#### `print:receipt`

طباعة فاتورة البيع.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| saleId | Number | نعم | معرف البيع |
| printerName | String | لا | اسم الطابعة |

**مثال:**
```javascript
await window.api.invoke('print:receipt', {
  saleId: 42,
  printerName: 'ThermalPrinter'
});
```

#### `print:barcode`

طباعة الباركود.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| productId | Number | نعم | معرف المنتج |
| quantity | Number | لا | عدد الملصقات |

**مثال:**
```javascript
await window.api.invoke('print:barcode', {
  productId: 15,
  quantity: 10
});
```

---

### 🔐 الترخيص والمصادقة

#### `license:validate`

التحقق من صحة الترخيص الحالي.

**الاستجابة:**
```javascript
{
  valid: true,
  expiresAt: '2025-12-31T23:59:59Z',
  deviceHash: 'abc123...'
}
```

**مثال:**
```javascript
const licenseStatus = await window.api.invoke('license:validate');
if (!licenseStatus.valid) {
  showActivationDialog();
}
```

#### `license:activate`

تفعيل ترخيص جديد.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| licenseKey | String | نعم | مفتاح الترخيص |

**مثال:**
```javascript
try {
  await window.api.invoke('license:activate', {
    licenseKey: 'ULTRA-POS-...'
  });
  showSuccessMessage('تم تفعيل التطبيق!');
} catch (error) {
  showErrorMessage('مفتاح غير صالح');
}
```

#### `auth:login`

تسجيل دخول المستخدم.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| username | String | نعم | اسم المستخدم |
| password | String | نعم | كلمة المرور |

**الاستجابة:**
```javascript
{
  success: true,
  user: {
    id: 1,
    username: 'admin',
    role: 'administrator'
  },
  token: 'session-token-123'
}
```

---

### ⚙️ إعدادات النظام

#### `settings:get`

استرجاع الإعدادات.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| key | String | لا | مفتاح محدد أو null للكل |

**مثال:**
```javascript
// استرجاع إعداد محدد
const taxRate = await window.api.invoke('settings:get', { key: 'tax_rate' });

// استرجاع جميع الإعدادات
const allSettings = await window.api.invoke('settings:get');
```

#### `settings:update`

تحديث إعداد.

**المعاملات:**
| الاسم | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| key | String | نعم | مفتاح الإعداد |
| value | Any | نعم | القيمة الجديدة |

**مثال:**
```javascript
await window.api.invoke('settings:update', {
  key: 'tax_rate',
  value: 0.20
});
```

---

## إدارة الأحداث (send/on)

### أحداث من Main إلى Renderer

#### `sale:completed`

يتم إطلاقه بعد إتمام عملية بيع.

**البيانات:**
```javascript
{
  saleId: 42,
  total: 158.97,
  timestamp: '2024-01-15T14:30:00Z'
}
```

**الاستماع:**
```javascript
window.api.on('sale:completed', (data) => {
  console.log('تم إتمام البيع:', data);
  updateDashboard();
});
```

#### `inventory:low-stock`

يتم إطلاقه عندما يصل منتج إلى الحد الأدنى.

**البيانات:**
```javascript
{
  productId: 15,
  productName: 'قهوة عربية',
  currentStock: 5,
  minStock: 10
}
```

#### `license:expired`

يتم إطلاقه عند انتهاء الترخيص.

**مثال:**
```javascript
window.api.on('license:expired', () => {
  showActivationDialog();
  disableFeatures();
});
```

---

## أمان IPC

### أفضل الممارسات

1. **التحقق من صحة البيانات في الخلفية**
   ```javascript
   // ❌ خطأ
   ipcMain.handle('delete-product', (event, id) => {
     database.delete('products', id);
   });

   // ✅ صحيح
   ipcMain.handle('delete-product', (event, id) => {
     if (!Number.isInteger(id) || id <= 0) {
       throw new Error('Invalid product ID');
     }
     return database.delete('products', id);
   });
   ```

2. **إدارة الأخطاء**
   ```javascript
   // الواجهة الأمامية
   try {
     const result = await window.api.invoke('sales:create', data);
   } catch (error) {
     console.error('خطأ في البيع:', error.message);
     showErrorToUser(error.message);
   }
   ```

3. **المهلة الزمنية للعمليات الطويلة**
   ```javascript
   const timeout = 5000; // 5 ثوانٍ
   const result = await Promise.race([
     window.api.invoke('heavy-operation'),
     new Promise((_, reject) => 
       setTimeout(() => reject(new Error('Timeout')), timeout)
     )
   ]);
   ```

---

## تصحيح أخطاء IPC

### تفعيل السجلات

```javascript
// في preload.js
console.log('[IPC] القناة:', channel, 'البيانات:', data);
```

### مراقبة الاستدعاءات

```javascript
// في main.js
ipcMain.handle('*', (event, ...args) => {
  console.log(`[IPC Handler] ${event.frameId}:`, args);
});
```

---

## المرجع الكامل

للحصول على القائمة الكاملة لقنوات IPC المتاحة، راجع:
- `src/preload.js` - عرض APIs
- `src/main.js` - معالجات IPC
- [دليل المطور](./DEVELOPER_GUIDE_AR.md)

---

**التنقل:**
- [← العودة إلى README](./README_AR.md)
- [API قاعدة البيانات ←](./API_DATABASE_AR.md)
