# SAP Business One UI Components Library

Bu kütüphane, SAP Business One standartlarına %100 uygun UI bileşenlerini içerir. Toplam 13 adet bileşen JavaScript fonksiyonları ve CSS stilleri ile geliştirilmiştir.

## 📁 Dosyalar

- **`sbo-components.js`** - Ana JavaScript bileşen kütüphanesi
- **`sbo-components.css`** - Ana CSS stil dosyası
- **`demo.html`** - Tüm bileşenlerin demo sayfası
- **`README.md`** - Bu dokümantasyon dosyası

## 🎨 Renk Paleti

Proje, SAP B1 standartlarına uygun katı renk paleti kullanır:

```css
--sbo-color-topbar: #AEAEAE;              /* Üst bar */
--sbo-color-topbar-strip: #F7D166;        /* Üst barın altındaki şerit */
--sbo-color-background: #F3F3F3;          /* Genel form arka planı */
--sbo-color-button-default: #F4D56E;      /* Genel buton rengi */
--sbo-color-input-focus: #F4D56E;         /* Aktif veri giriş alanları */
--sbo-color-button-add-accent: #F5C03D;   /* "Ekle" butonunun sol vurgusu */
--sbo-color-disabled-bg: #E7E7E7;         /* Pasif alanların arka planı */
```

## 🧩 Bileşen Listesi

### 1. Aşama - Temel Bileşenler
1. **StaticText** - Etiket/Label bileşeni
2. **EditText** - Metin giriş kutusu
3. **LinkedButton** - Karakteristik sarı ok bileşeni
4. **Button** - Standart düğme bileşeni
5. **CheckBox** - Onay kutusu bileşeni

### 2. Aşama - İkincil Bileşenler
6. **ComboBox** - Açılır liste
7. **ExtendedEditText** - Çok satırlı metin kutusu
8. **OptionButton** - Radyo düğmesi
9. **TabControl** - Sekme kontrolü

### 3. Aşama - Karmaşık Bileşenler
10. **Grid** - Salt okunur tablo
11. **Matrix** - Düzenlenebilir tablo
12. **PictureBox** - Resim kutusu
13. **ButtonCombo** - Düğme kombinasyonu

## 🚀 Kullanım

### Kurulum

CSS ve JS dosyalarını projenize dahil edin:

```html
<link rel="stylesheet" href="sbo-components.css">
<script src="sbo-components.js"></script>
```

## Pencere Oluşturma

### Basit Pencere

```javascript
const myWindow = createSBOWindow({
    uniqueId: 'myWindow1',
    title: 'Müşteri Kartı',
    width: '800px',
    height: '600px',
    content: '<p>İçerik buraya gelir</p>',
    showMinimize: true,
    showMaximize: true,
    showClose: true,
    showStrip: true
});

document.body.insertAdjacentHTML('beforeend', myWindow);
```

### Form Penceresi

```javascript
const formContent = `
    <div style="padding: 16px;">
        ${createSBOStaticText({ caption: 'Müşteri Kodu', isRequired: true, width: '120px' })}
        ${createSBOEditText({ uniqueId: 'customerCode', width: '150px' })}
        ${createSBOLinkedButton({ linkTo: 'customerCode', linkedObject: '2' })}
    </div>
`;

const formWindow = createSBOFormWindow({
    uniqueId: 'customerForm',
    title: 'İş Ortağı Ana Verisi',
    width: '700px',
    height: '500px',
    formContent: formContent,
    showFormButtons: true
});

document.body.insertAdjacentHTML('beforeend', formWindow);
```

### Pencere Kontrolleri

```javascript
// Minimize/Restore
handleWindowMinimize('myWindow1');

// Maximize/Restore
handleWindowMaximize('myWindow1');

// Kapat
handleWindowClose('myWindow1');
```

### Event Dinleme

```javascript
// Minimize event
document.addEventListener('sboWindowMinimize', function(e) {
    console.log('Pencere:', e.detail.windowId);
});

// Form butonları
document.addEventListener('sboFormAdd', function(e) {
    console.log('Ekle tıklandı:', e.detail.formWindowId);
});

document.addEventListener('sboFormUpdate', function(e) {
    console.log('Güncelle tıklandı:', e.detail.formWindowId);
});
```

## Bileşen Kullanım Örnekleri

### Temel Kullanım

#### StaticText (Etiket)
```javascript
// Basit etiket
const label = createSBOStaticText({
    caption: 'Müşteri Kodu'
});

// Zorunlu alan etiketi
const requiredLabel = createSBOStaticText({
    caption: 'Zorunlu Alan',
    isRequired: true
});
```

#### EditText (Metin Kutusu)
```javascript
// Basit metin kutusu
const textBox = createSBOEditText({
    uniqueId: 'customerCode',
    placeholder: 'Müşteri kodunu girin...',
    width: '150px'
});

// Şifre kutusu
const passwordBox = createSBOEditText({
    uniqueId: 'password',
    isPassword: true
});
```

#### LinkedButton (Sarı Ok)
```javascript
// EditText ile bağlantılı sarı ok
const linkedButton = createSBOLinkedButton({
    linkTo: 'customerCode',
    linkedObject: '2'  // 2 = Muhatap
});
```

#### Button (Düğme)
```javascript
// Normal düğme
const button = createSBOButton({
    caption: 'Kaydet'
});

// Ana işlem düğmesi
const addButton = createSBOAddButton({
    caption: 'Ekle'
});
```

#### CheckBox (Onay Kutusu)
```javascript
// Basit onay kutusu
const checkBox = createSBOCheckBox({
    uniqueId: 'isActive',
    caption: 'Aktif'
});
```

### Kombinasyon Kullanımı

#### EditText + LinkedButton
```javascript
// StaticText + EditText + LinkedButton kombinasyonu
const customerField = createSBOInputWithLinkedButton({
    labelText: 'Müşteri Kodu',
    editTextId: 'customerCode',
    linkedObject: '2'
});
```

#### Form Düğmeleri
```javascript
// Form alt kısmı düğme grubu
const formButtons = `
<div class="sbo-form-buttons">
    <div class="sbo-form-buttons__left">
        ${createSBOAddButton({ caption: 'Ekle' })}
        ${createSBOUpdateButton({ caption: 'Güncelle' })}
    </div>
    <div class="sbo-form-buttons__right">
        ${createSBOCancelButton({ caption: 'İptal' })}
    </div>
</div>
`;
```

### İkincil Bileşenler

#### ComboBox (Açılır Liste)
```javascript
// Basit ComboBox
const comboBox = createSBOComboBox({
    uniqueId: 'statusCombo',
    options: [
        { value: 'A', text: 'Aktif' },
        { value: 'P', text: 'Pasif' },
        { value: 'C', text: 'İptal' }
    ]
});
```

#### ExtendedEditText (Çok Satırlı Metin)
```javascript
// Çok satırlı metin kutusu
const textArea = createSBOExtendedEditText({
    uniqueId: 'notes',
    placeholder: 'Notlarınızı buraya yazın...',
    width: '300px',
    height: '100px'
});
```

#### OptionButton (Radyo Düğmesi)
```javascript
// Radyo düğme grubu
const radioGroup =
    createSBOOptionButton({ uniqueId: 'opt1', name: 'type', caption: 'Seçenek 1', isChecked: true }) +
    createSBOOptionButton({ uniqueId: 'opt2', name: 'type', caption: 'Seçenek 2' });
```

### Karmaşık Bileşenler

#### TabControl (Sekme Kontrolü)
```javascript
// Sekme kontrolü
const tabControl = createSBOTabControl({
    uniqueId: 'mainTabs',
    tabs: [
        { id: 'general', caption: 'Genel', content: '<p>Genel bilgiler</p>' },
        { id: 'details', caption: 'Detaylar', content: '<p>Detay bilgileri</p>' }
    ],
    activeTab: 'general',
    width: '500px',
    height: '300px'
});
```

#### Grid (Salt Okunur Tablo)
```javascript
// Veri tablosu
const dataGrid = createSBOGrid({
    uniqueId: 'dataGrid',
    columns: [
        { id: 'code', caption: 'Kod', width: '100px' },
        { id: 'name', caption: 'İsim', width: '200px' },
        { id: 'amount', caption: 'Tutar', width: '100px', align: 'right' }
    ],
    data: [
        { code: 'A001', name: 'Ürün A', amount: '1,250.00' },
        { code: 'B002', name: 'Ürün B', amount: '850.50' }
    ],
    width: '450px',
    height: '200px'
});
```

#### Matrix (Düzenlenebilir Tablo)
```javascript
// Düzenlenebilir tablo
const editableMatrix = createSBOMatrix({
    uniqueId: 'itemMatrix',
    columns: [
        { id: 'item', caption: 'Ürün', width: '150px', type: 'edittext' },
        { id: 'qty', caption: 'Miktar', width: '80px', type: 'edittext' },
        { id: 'price', caption: 'Fiyat', width: '100px', type: 'edittext' }
    ],
    data: [
        { item: 'Ürün 1', qty: '10', price: '25.00' }
    ],
    width: '380px',
    height: '150px'
});
```

## 📱 Responsive Tasarım

Tüm bileşenler mobil uyumlu responsive tasarım içerir:

- **Desktop**: Tam özellikli SAP B1 görünümü
- **Tablet**: Orta boyut ekranlar için optimize edilmiş
- **Mobile**: Dokunmatik kullanım için büyütülmüş elementler

## 🎯 Event Sistemi

Bileşenler custom event'ler fırlatır:

```javascript
// EditText değişimi
document.addEventListener('sboEditTextChanged', function(e) {
    console.log('Değer değişti:', e.detail.value);
});

// LinkedButton tıklama
document.addEventListener('sboLinkedButtonClicked', function(e) {
    console.log('LinkedButton tıklandı:', e.detail.linkedObject);
});

// CheckBox değişimi
document.addEventListener('sboCheckBoxChanged', function(e) {
    console.log('CheckBox durumu:', e.detail.checked);
});
```

## 🛠️ Geliştirme

### Dosya Yapısı
```
SAP Tasarım/
├── sbo-components.js          # Ana JavaScript kütüphanesi
├── sbo-components.css         # Ana CSS dosyası
├── demo.html                  # Demo sayfası
├── README.md                  # Dokümantasyon
└── Theme/                     # SAP B1 tema varlıkları
    └── 9.0/
        └── 2d/
            ├── Buttons/       # Düğme ikonları
            ├── Checkbox/      # CheckBox durumları
            └── ...
```

### Yeni Bileşen Ekleme

1. `sbo-components.js` dosyasına yeni fonksiyon ekleyin
2. `sbo-components.css` dosyasına ilgili stilleri ekleyin
3. `demo.html` dosyasına örnek kullanım ekleyin
4. README.md dosyasını güncelleyin

## 📋 Test Etme

1. `demo.html` dosyasını web tarayıcısında açın
2. Tüm bileşenlerin düzgün göründüğünü kontrol edin
3. Event log'unda etkileşimlerin kayıtlarını izleyin
4. Responsive tasarımı farklı ekran boyutlarında test edin

## 🎨 Tema Uyumluluk

- SAP Business One 9.0 tema varlıkları desteklenir
- `Theme/9.0/2d/` klasöründeki ikonlar referans alınır
- Tüm renkler CSS değişkenleri ile yönetilebilir

## 📝 Notlar

- **JavaScript dosyası**: Tüm 13 bileşeni içerir (StaticText'ten ButtonCombo'ya kadar)
- **CSS dosyası**: Tüm 13 bileşenin stillerini içerir + Theme klasörü varlıklarını kullanır
- **LinkedButton ve CheckBox**: Theme/9.0/2d/ klasöründeki orijinal SAP B1 varlıklarını kullanır
- **Demo sayfası**: Tüm 13 bileşenin interaktif örneklerini gösterir

## 🚧 Gelecek Geliştirmeler

- [x] ~~Kalan 8 bileşenin dosyalara eklenmesi~~ ✅ Tamamlandı
- [x] ~~Theme klasörü varlıklarının entegrasyonu~~ ✅ Tamamlandı
- [ ] Tam form şablonlarının oluşturulması
- [ ] TypeScript desteği
- [ ] Unit test'lerin yazılması
- [ ] NPM paketi haline getirilmesi

## 📞 Destek

Herhangi bir sorun veya öneriniz için:
- Dosyaları inceleyerek örnekleri görebilirsiniz
- Demo sayfasında tüm bileşenleri test edebilirsiniz
- Event log'unda etkileşimleri takip edebilirsiniz

---

**Versiyon**: 1.0.0
**Son Güncelleme**: 2024
**Geliştirici**: SAP B1 UI Components Team