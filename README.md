# Kripros

Birikimlerini, harcamalarını ve gelirini tek yerde takip eden mobil uygulama (Expo / React Native).

- **Google ile giriş**: hesap sistemi Supabase Auth üzerinde, yalnızca Google (Apple ileride).
- **Gelir · Harcama · Birikim** kayıtları, kategoriler ve "Kahve almadım · 85 ₺ · günlük" gibi birikim alışkanlıkları.
- **Grafikler**: son 7 gün / 5 hafta / 12 ay karşılaştırması, kategori dağılımı (halka grafik), takvim görünümü.
- **Hedefler**: "Yaz tatili 40.000 ₺" gibi hedefler, ilerleme ve "ayda ne kadar biriktirmeliyim" hesabı.
- **Çevrimdışı çalışır**: tüm veriler cihazda tutulur, internet gelince otomatik eşitlenir. Birden fazla cihazda aynı hesap kullanılabilir.
- **Eski veriler**: uygulamanın önceki (yalnızca cihazda saklayan) sürümündeki birikimler tek dokunuşla hesaba aktarılır.

---

## Kurulum (yaklaşık 15 dakika)

### 1. Bağımlılıklar

```bash
npm install
```

### 2. Supabase projesi

1. [supabase.com](https://supabase.com) → **New project** (ücretsiz plan yeterli).
2. **SQL Editor → New query** → [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) dosyasının tamamını yapıştır → **Run**.
3. **Project Settings → API** sayfasından **Project URL** ve **anon / publishable key** değerlerini al.

### 3. Google ile giriş

1. [Google Cloud Console](https://console.cloud.google.com/) → yeni proje → **APIs & Services → OAuth consent screen** (External, uygulama adı: Kripros).
2. **Credentials → Create credentials → OAuth client ID → Web application**.
   - **Authorized redirect URIs**: `https://<PROJE-REF>.supabase.co/auth/v1/callback`
3. Oluşan **Client ID** ve **Client secret**'ı Supabase'de **Authentication → Sign In / Providers → Google** bölümüne yapıştır ve etkinleştir.
4. Aynı sayfada **Email** sağlayıcısını **kapat** (yalnızca Google ile giriş kabul ediliyor).
5. **Authentication → URL Configuration → Redirect URLs** listesine ekle:
   - `kripros://**` (uygulamanın kendi derlemesi)
   - `exp://**` (Expo Go ile geliştirme)
   - `http://localhost:8081/**` (tarayıcıda geliştirme)

### 4. Ortam değişkenleri

```bash
cp .env.example .env
# .env içine Project URL ve anon key'i yaz
```

### 5. Çalıştır

```bash
npx expo start          # telefonda Expo Go ile QR kodu okut
npx expo start --web    # tarayıcıda
```

> `.env` değiştiğinde önbelleği temizleyerek başlat: `npx expo start -c`

### Supabase olmadan denemek (yalnızca geliştirme)

```bash
EXPO_PUBLIC_DEMO_MODE=1 npx expo start
```

Giriş ekranını atlar ve örnek verilerle tamamen cihaz üzerinde çalışır. Yayın derlemelerinde bu ayar yok sayılır.

---

## Nasıl çalışıyor?

```
Ekranlar ──► DataContext ──► SyncEngine ──► AsyncStorage (cihazdaki kopya)
                                  │
                                  └──(internet varken)──► Supabase (Postgres + RLS)
```

- **Önce cihaz**: her değişiklik anında cihaza yazılır ve bir "gönderilecekler" kuyruğuna girer. Bağlantı geldiğinde, uygulama öne alındığında ve açıkken 2 dakikada bir eşitleme yapılır.
- **Çakışmalar**: aynı kayıt iki cihazda değiştirildiyse **en son yapılan değişiklik** kazanır. Kural sunucuda uygulanır; eski bir düzenleme yeni olanın üzerine yazamaz.
- **Silme**: kayıtlar önce "silindi" olarak işaretlenir ki diğer cihazlar da öğrensin.
- **Güvenlik**: her tabloda satır seviyesinde güvenlik (RLS) açık; kullanıcı yalnızca kendi satırlarını görebilir ve yazabilir. Başka bir kullanıcının kategorisine/hedefine bağlanmak veritabanı düzeyinde engellenir.
- **Hesap silme**: Profil → "Hesabımı sil" tüm verileri sunucudan ve cihazdan kalıcı olarak siler (mağaza politikaları bunu zorunlu tutuyor).

### Veritabanı

| Tablo | İçerik |
|---|---|
| `profiles` | Görünen ad, para birimi (kayıt olunca otomatik oluşur) |
| `categories` | Gelir/harcama kategorileri (varsayılanlar kayıtta otomatik eklenir) |
| `saving_templates` | Birikim alışkanlıkları |
| `goals` | Birikim hedefleri |
| `transactions` | Tüm kayıtlar: `income` / `spending` / `saving` |
| `subscriptions` | Üyelik durumu, **yalnızca sunucu yazabilir** (ödeme entegrasyonu için hazır) |

---

## Testler ve kontroller

```bash
npm test            # birim testleri: eşitleme motoru, hesaplamalar, tutar/tarih işlemleri
npm run lint        # ESLint
npm run test:db     # veritabanı güvenlik testleri (yerel PostgreSQL gerekir)
npm run check:bundle  # Android JS paketinin derlendiğini doğrular
```

`test:db`, geçici bir veritabanı oluşturur, Supabase'in gerekli kısımlarını taklit eden küçük bir katman kurar, migration'ı çalıştırır ve RLS kurallarını, çakışma çözümünü ve hesap silmeyi test eder.

---

## Sonraki adımlar

- **Ödemeler (premium)**: Android'de dijital içerik/abonelik satışı için Google Play politikası **Google Play Billing**'i zorunlu tutar (Google Pay doğrudan kullanılamaz; kullanıcı Play Billing ekranında Google Pay ile ödeyebilir). iOS'ta karşılığı App Store In-App Purchase. Önerilen yol: `react-native-iap` ya da RevenueCat + satın alımı doğrulayıp `subscriptions` tablosuna yazan bir Supabase Edge Function. Uygulama `subscriptions` tablosunu zaten okuyor (Profil'de plan görünür).
- **Apple ile giriş**: `expo-apple-authentication` + `supabase.auth.signInWithIdToken`. App Store, Google ile giriş sunan uygulamalarda Apple ile girişi de şart koşar; iOS yayınından önce eklenmeli.
- **Yayın öncesi**: Android paket adı hâlâ `com.anonymous.project_kripros`; Play Store'a çıkmadan önce kalıcı bir adla değiştirilmeli (`app.json` ve `android/`). Derleme için EAS Build önerilir.
- Supabase ücretsiz planında proje 1 hafta kullanılmazsa duraklatılır; panelden tek tıkla yeniden başlatılır.

---

## Proje yapısı

```
App.js                     giriş noktası: oturum → veri → ekranlar
src/
  config.js                .env değerleri
  theme.js                 renkler, boşluklar
  lib/                     supabase istemcisi, tutar/tarih yardımcıları, diyaloglar
  sync/                    çevrimdışı eşitleme motoru, cihaz depolaması, Supabase bağdaştırıcısı
  domain/                  istatistikler, öneriler, eski veri aktarımı, demo verisi
  state/                   AuthContext (Google girişi), DataContext (veriler + işlemler)
  navigation/              sekmeler ve tam ekran pencereler
  screens/                 Özet, Takvim, Hedefler, Geçmiş, Giriş
  sheets/                  Kayıt ekle/düzenle, Gün detayı, Hedef, Profil, Kategoriler, Alışkanlıklar
  components/              ortak arayüz parçaları ve grafikler
supabase/
  migrations/0001_init.sql veritabanı şeması, RLS, tetikleyiciler
  tests/                   veritabanı güvenlik testleri
```
