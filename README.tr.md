<div align="center">

<img src="assets/icon.png" width="96" alt="Kripros ikonu">

# Kripros

Birikimlerini, harcamalarını ve gelirini tek yerde takip eden bir mobil uygulama (Expo / React Native).<br>
Tamamen cihazda çalışır: hesap yok, sunucu yok, internet gerekmez.

**[Canlı demo](https://r9xdty.github.io/project_kripros/)** · [English](README.md)

</div>

| Özet | Grafikler | Takvim |
|:---:|:---:|:---:|
| <img src="docs/screenshots/dashboard.png" width="240" alt="Özet ekranı"> | <img src="docs/screenshots/charts.png" width="240" alt="Çubuk ve halka grafikler"> | <img src="docs/screenshots/calendar.png" width="240" alt="Takvim ekranı"> |
| **Hedefler** | **Geçmiş** | **Yeni kayıt** |
| <img src="docs/screenshots/goals.png" width="240" alt="Hedefler ekranı"> | <img src="docs/screenshots/history.png" width="240" alt="Geçmiş ekranı"> | <img src="docs/screenshots/new-record.png" width="240" alt="Yeni kayıt formu"> |

> Canlı demoda **“Örnek verilerle keşfet”** seçeneği birkaç aylık örnek veriyle başlatır.

## Özellikler

- **Gelir, harcama ve birikim kayıtları**, düzenlenebilir kategorilerle.
- **Birikim alışkanlıkları**: "Kahve almadım · 85 ₺ · günlük" gibi tekrar eden tasarruflar. Zamanı gelenler ana sayfada ve takvimde öneri olarak çıkar, tek dokunuşla eklenir.
- **Grafikler**: son 7 gün / 5 hafta / 12 ay için gelir, harcama ve birikimi yan yana gösteren çubuk grafik. Aylık dağılım için halka grafik. İkisi de kütüphanesiz, doğrudan SVG ile çizilir.
- **Takvim**: her günün toplamları; bir güne dokununca o günün kayıtları.
- **Hedefler**: "Yaz tatili 40.000 ₺" gibi hedefler. İlerleme, kalan tutar ve hedef tarihine yetişmek için gereken aylık tutar.
- **Geçmiş**: günlere göre gruplu, aranabilir ve türe göre filtrelenebilir liste.
- **Türkçe tutar girişi**: `45,50`, `1.250`, `1.250,75` doğru okunur. Toplamlar kuruş hassasiyetinde, kayan nokta hatası olmadan hesaplanır.

## Çalıştırma

```bash
npm install
npx expo start          # telefonda Expo Go ile QR kodu okut
npx expo start --web    # tarayıcıda
```

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm test` | Jest birim testleri |
| `npm run lint` | ESLint |
| `npm run check:bundle` | Android JS paketinin derlendiğini doğrular |

Her push ve pull request'te GitHub Actions kod denetimini, testleri ve web derlemesini çalıştırır. `main` dalına yapılan her push web sürümünü GitHub Pages'te yayınlar.

## Nasıl çalışıyor?

- **Expo SDK 53, React Native 0.79 (New Architecture), React 19**. Aynı kod Android, iOS ve web'de çalışır.
- **Veri deposu** (`src/store`): kayıtlar arayüz için bellekte tutulur ve AsyncStorage'a kaydedilir.
  - Aynı anda yapılan değişiklikler tek bir yazma işleminde birleştirilir.
  - Büyük tablolar 16 parçaya bölünür; böylece Android'deki tek kayıt başına ~2 MB sınırına takılmaz ve yalnızca değişen parça yeniden yazılır.
- **Hesaplamalar** (`src/domain`): istatistikler, öneri algoritması ve hedef ilerlemesi arayüzden bağımsız, saf fonksiyonlardır ve birim testleriyle kapsanır.
- **Tarihler** `YYYY-MM-DD` biçiminde, yerel gün olarak saklanır. Böylece saat dilimi yüzünden kayıtlar yanlış güne kaymaz.
- **Pencereler** tek bir `Modal` içinde yığın olarak açılır. iOS'ta iç içe birden fazla `Modal` açmak güvenilir çalışmadığı için bu yol seçildi; alttaki pencerenin form durumu da korunur.

## Proje yapısı

```
App.js              giriş noktası: veri → karşılama ya da ana ekran
app.json            Expo ayarları
app.config.js       CI'daki web derlemesine GitHub Pages yolunu ekler
src/
  store/            cihazdaki veri deposu (AsyncStorage)
  state/            DataContext: ekranlar için veriler ve işlemler
  domain/           istatistikler, öneriler, doğrulama, varsayılan/örnek veriler
  lib/              tutar ve tarih yardımcıları, diyaloglar, kimlikler
  navigation/       sekmeler ve pencere yığını
  screens/          Özet, Takvim, Hedefler, Geçmiş, Karşılama
  sheets/           kayıt, gün, hedef, ayarlar, kategori ve alışkanlık pencereleri
  components/       ortak arayüz parçaları ve SVG grafikler
docs/screenshots/   README görselleri
.github/workflows/  CI ve GitHub Pages yayını
```

## Lisans

[MIT](LICENSE)
