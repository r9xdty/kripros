<div align="center">

<img src="assets/icon.png" width="96" alt="Kripros ikonu">

# Kripros

Birikimlerini, harcamalarını ve gelirini tek yerde takip eden bir mobil uygulama (Expo / React Native).<br>
Tamamen cihazda çalışır: hesap yok, sunucu yok, internet gerekmez.

**[Canlı demo](https://r9xdty.github.io/kripros/)** · [English](README.md)

</div>

| Özet | Grafikler | Takvim |
|:---:|:---:|:---:|
| <img src="docs/screenshots/dashboard.png" width="240" alt="Özet ekranı"> | <img src="docs/screenshots/charts.png" width="240" alt="Çubuk ve halka grafikler"> | <img src="docs/screenshots/calendar.png" width="240" alt="Takvim ekranı"> |
| **Bütçeler** | **Düzenli işlemler** | **Yedekleme ve ayarlar** |
| <img src="docs/screenshots/budgets.png" width="240" alt="Kategori bütçeleri"> | <img src="docs/screenshots/recurring.png" width="240" alt="Düzenli gelir ve harcamalar"> | <img src="docs/screenshots/backup.png" width="240" alt="Yedekleme ve ayarlar"> |
| **Hedefler** | **Geçmiş** | **Yeni kayıt** |
| <img src="docs/screenshots/goals.png" width="240" alt="Hedefler ekranı"> | <img src="docs/screenshots/history.png" width="240" alt="Geçmiş ekranı"> | <img src="docs/screenshots/new-record.png" width="240" alt="Yeni kayıt formu"> |

> Canlı demoda **“Örnek verilerle keşfet”** seçeneği birkaç aylık örnek veriyle başlatır.

## Özellikler

- **Gelir, harcama ve birikim kayıtları**, düzenlenebilir kategorilerle.
- **Bütçeler**: harcama kategorilerine aylık sınır. Ana sayfada her bütçenin ne kadarının kullanıldığı görünür; yeni bir harcama %80'i ya da sınırı geçince uyarı çıkar.
- **Düzenli işlemler**: maaş, kira, abonelik gibi kayıtlar bir kez tanımlanır ("her ayın 5. günü") ve günü gelince kendiliğinden eklenir; uygulama bir süre açılmasa bile. Yaklaşanlar ana sayfada listelenir.
- **Yedekleme**: tüm kayıtlar tek bir JSON dosyasına aktarılır; başka bir telefonda ya da yeniden kurulumdan sonra karşılama ekranından geri yüklenir.
- **Birikim alışkanlıkları**: "Kahve almadım · 85 ₺ · günlük" gibi tekrar eden tasarruflar. Zamanı gelenler ana sayfada ve takvimde öneri olarak çıkar, tek dokunuşla eklenir.
- **Grafikler**: son 7 gün / 5 hafta / 12 ay için gelir, harcama ve birikimi yan yana gösteren çubuk grafik. Aylık dağılım için halka grafik. İkisi de kütüphanesiz, doğrudan SVG ile çizilir.
- **Takvim**: her günün toplamları; bir güne dokununca o günün kayıtları.
- **Hedefler**: "Yaz tatili 40.000 ₺" gibi hedefler. İlerleme, kalan tutar ve hedef tarihine yetişmek için gereken aylık tutar.
- **Geçmiş**: günlere göre gruplu, aranabilir ve türe göre filtrelenebilir liste.
- **İçgörüler**: bu ayın harcamasının geçen ayın aynı günleriyle karşılaştırması, birikim oranı ve birikim serisi.
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
- **Hesaplamalar** (`src/domain`): istatistikler, bütçeler, düzenli işlemler, yedekler, öneri algoritması ve hedef ilerlemesi arayüzden bağımsız, saf fonksiyonlardır ve birim testleriyle kapsanır.
- **Düzenli işlemler** bir sonraki tarihlerini saklar. Uygulama açıldığında ya da öne geldiğinde zamanı gelen kayıtlar eklenir ve kural bir ay ileri gider. 31'i kısa aylarda ayın son gününe denk gelir; kuralın günü değiştirildiğinde aynı ay iki kez kaydedilmez.
- **Yedek dosyaları** cihazdaki veriler değiştirilmeden önce baştan sona denetlenir (biçim, sürüm, her kayıt).
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
  domain/           istatistikler, bütçeler, düzenli işlemler, yedekler, öneriler,
                    doğrulama, varsayılan/örnek veriler
  lib/              tutar ve tarih yardımcıları, diyaloglar, kimlikler, dosya kaydetme/açma
  navigation/       sekmeler ve pencere yığını
  screens/          Özet, Takvim, Hedefler, Geçmiş, Karşılama
  sheets/           kayıt, gün, hedef, ayarlar, kategori, alışkanlık ve düzenli işlem pencereleri
  components/       ortak arayüz parçaları ve SVG grafikler
docs/screenshots/   README görselleri
.github/workflows/  CI ve GitHub Pages yayını
```

## Lisans

[MIT](LICENSE)
