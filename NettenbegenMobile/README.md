# 📱 Nettenbegen Mobile App

Nettenbegen e-ticaret sitesinin mobil uygulaması. React Native ve Expo ile geliştirilmiştir.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Ana Sayfa**: Slider, kategoriler, öne çıkan ürünler
- **Ürün Listesi**: Filtreleme, arama, sıralama
- **Navigasyon**: Bottom tabs ve stack navigation
- **API Entegrasyonu**: Web sitesi ile veri senkronizasyonu
- **Offline Destek**: Local storage ile veri önbellekleme

### 🔄 Geliştirilmekte Olan Özellikler
- **Sepet Sistemi**: Ürün ekleme, çıkarma, miktar güncelleme
- **Kullanıcı Hesabı**: Giriş, kayıt, profil yönetimi
- **Sipariş Sistemi**: Sipariş oluşturma, takip etme
- **Ödeme Sistemi**: Güvenli ödeme entegrasyonu
- **Admin Panel**: Mobil yönetim paneli

### 📋 Planlanan Özellikler
- **Push Bildirimleri**: Sipariş durumu, kampanyalar
- **QR Kod Okuma**: Hızlı ürün tarama
- **Kamera Entegrasyonu**: Fotoğraf çekme, ürün arama
- **Offline Çalışma**: İnternet olmadan temel özellikler
- **Çoklu Dil**: Türkçe ve İngilizce desteği

## 🛠️ Teknoloji Stack

- **Framework**: React Native + Expo
- **Dil**: TypeScript
- **Navigasyon**: React Navigation
- **State Management**: React Hooks
- **Storage**: AsyncStorage
- **UI Components**: React Native Paper
- **Icons**: Expo Vector Icons

## 📱 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo CLI
- Android Studio (Android için)
- Xcode (iOS için, sadece macOS)

### Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone https://github.com/ERKAN675/nettenbegen-ecommerce.git
cd NettenbegenMobile
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Uygulamayı başlatın**
```bash
npm start
```

4. **Platform seçin**
- **Android**: `npm run android`
- **iOS**: `npm run ios` (sadece macOS)
- **Web**: `npm run web`

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── screens/            # Ekran bileşenleri
├── navigation/         # Navigasyon yapılandırması
├── services/           # API servisleri
├── types/              # TypeScript tip tanımları
├── utils/              # Yardımcı fonksiyonlar
└── assets/             # Resimler, fontlar vb.
```

## 🔧 Konfigürasyon

### API Ayarları
`src/services/api.ts` dosyasında API base URL'ini güncelleyin:

```typescript
const API_BASE_URL = 'https://your-domain.com/';
```

### Tema Ayarları
Ana renkler ve stiller `src/types/index.ts` dosyasında tanımlanmıştır.

## 📱 Ekran Görüntüleri

### Ana Sayfa
- Slider ile kampanya gösterimi
- Kategori listesi
- Öne çıkan ürünler
- Hızlı erişim butonları

### Ürün Listesi
- Grid görünümü
- Arama ve filtreleme
- Kategori filtreleme
- Fiyat sıralama

## 🚀 Dağıtım

### Android APK
```bash
expo build:android
```

### iOS App Store
```bash
expo build:ios
```

### Web
```bash
expo build:web
```

## 🔗 Entegrasyon

### Web Sitesi Entegrasyonu
Mobil uygulama, web sitesi ile aşağıdaki verileri senkronize eder:
- Ürün bilgileri
- Kategori listesi
- Slider içerikleri
- Site ayarları

### Admin Panel Entegrasyonu
- Sipariş yönetimi
- Stok kontrolü
- Müşteri yönetimi
- Raporlar

## 📊 Performans

- **Başlangıç Süresi**: < 3 saniye
- **Sayfa Yükleme**: < 1 saniye
- **Offline Çalışma**: Temel özellikler
- **Bellek Kullanımı**: Optimize edilmiş

## 🐛 Hata Ayıklama

### Geliştirme Modu
```bash
npm start
```

### Logları Görüntüleme
```bash
expo logs
```

### Metro Bundler
```bash
npx react-native start
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Geliştirici**: Erkan
- **Email**: info@nettenbegen.com
- **Website**: https://nettenbegen.com

## 🙏 Teşekkürler

- React Native ekibi
- Expo ekibi
- React Navigation ekibi
- Tüm açık kaynak katkıda bulunanlar

---

**Nettenbegen Mobile App** - Güvenilir e-ticaret deneyimi 📱✨
