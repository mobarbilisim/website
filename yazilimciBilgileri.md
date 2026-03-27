# 🛠️ Yazılımcı Bilgileri — Mobar Bilişim

> Bu dosya, projeyi herhangi bir bilgisayarda sıfırdan kurmak ve geliştirmeye başlamak için gereken tüm bilgileri içerir.

## 🔄 Günlük Geliştirme İş Akışı

```bash
# 1. En son değişiklikleri çek (özellikle farklı bilgisayardan geçiş yapıldığında)
git pull

# 2. Kod değişikliklerini yap, sonra:
git add .
git commit -m "Değişiklik açıklaması"
git push
```

> Vercel, her `git push` sonrası otomatik olarak siteyi günceller (CI/CD).

## 📋 Gereksinimler

| Araç | Minimum Versiyon | İndirme |
|------|-----------------|---------|
| **Node.js** | LTS (v20+) | [nodejs.org](https://nodejs.org) |
| **Git** | v2.40+ | [git-scm.com](https://git-scm.com) |
| **npm** | Node.js ile birlikte gelir | — |

---

## 🚀 Yeni Bilgisayarda Kurulum (Adım Adım)

### 1. Repoyu Klonla
```bash
git clone https://github.com/mobarbilisim/website.git
cd website
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. `.env.local` Dosyasını Oluştur
Proje kök dizininde `.env.local` adında bir dosya oluştur ve aşağıdaki bilgileri yapıştır:

```env
NEXT_PUBLIC_SUPABASE_URL=https://oxulofzrdwopvegacpoa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase API Keys sayfasından al>
```

> ⚠️ **Anon Key'i nereden bulursun:**
> [Supabase Dashboard](https://supabase.com/dashboard) → `mobarbilisim` org → `web-site` projesi → **Settings** → **API Keys** → **Legacy anon, service_role API keys** sekmesi → `anon` key'i kopyala.

> 🔒 **Bu dosya `.gitignore`'da olduğu için GitHub'a yüklenmez. Her bilgisayarda ayrı oluşturulmalıdır.**

### 4. Geliştirme Sunucusunu Başlat
```bash
npm run dev
```
Tarayıcıda: [http://localhost:3000](http://localhost:3000)

## 💻 Bilgisayar Değiştirdiğinde Ne Yapmalısın?

Farklı bir bilgisayara (işten eve veya evden işe) geçtiğinde şu 3 adımı kontrol etmelisin:

1. **`git pull`**: Evet, tüm kod değişiklikleri yerel bilgisayarına gelir. Ama sadece **kodlar** gelir.
2. **`npm install`**: Eğer diğer bilgisayarda yeni bir paket yüklediysen (yazılım kütüphanesi), bu bilgisayarda da `npm install` çalıştırarak o paketleri indirmelisin. (Zararı olmaz, her geçişte bir kez çalıştırmak iyidir).
3. **`.env.local`**: Bu dosya GitHub'a **asla gitmez**. Eğer yeni bir bilgisayara ilk defa geçiyorsan, bu dosyayı elinle bir kez oluşturman gerekir. Dosya zaten varsa bir şey yapmana gerek yok.

**Özetle iş akışı:**
1. Bilgisayarı aç.
2. Terminalde `git pull` yap.
3. (Opsiyonel ama önerilir) `npm install` yap.
4. `npm run dev` ile çalışmaya başla.


## 🏗️ Proje Yapısı

```
website/
├── public/                    # Statik dosyalar (logo vb.)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Ana layout (Header + Footer)
│   │   ├── page.tsx           # Anasayfa
│   │   ├── globals.css        # Global stiller
│   │   ├── admin/             # Admin paneli sayfaları
│   │   ├── store/             # Mağaza & ürün detay
│   │   ├── cart/              # Sepet
│   │   ├── favorites/         # Favoriler
│   │   ├── login/             # Giriş sayfası
│   │   ├── iletisim/          # İletişim sayfası
│   │   ├── hakkimizda/        # Hakkımızda sayfası
│   │   ├── category/[slug]/   # Dinamik kategori
│   │   └── yazilim-cozumleri/ # Yazılım paketleri
│   ├── components/            # Paylaşılan bileşenler
│   └── lib/
│       ├── supabase/          # Supabase client (client.ts, server.ts, middleware.ts)
│       └── utils.ts           # Yardımcı fonksiyonlar
├── .env.local                 # 🔒 Supabase anahtarları (GİTHUB'A YÜKLENMEZsiniz)
├── package.json               # Bağımlılıklar
├── next.config.ts             # Next.js ayarları
└── tsconfig.json              # TypeScript ayarları
```

---

## 🔧 Teknoloji Stack

| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| Next.js | 16.2.1 | Framework (SSR + SSG + Turbopack) |
| React | 19.2.4 | UI Kütüphanesi |
| TypeScript | ^5 | Tip Güvenliği |
| Tailwind CSS | ^4 | Stil Sistemi |
| Supabase | ^2.100.0 | Veritabanı + Auth + Storage |
| Framer Motion | ^12.38.0 | Animasyonlar |
| Lucide React | ^1.4.0 | İkon Seti |

---

## ☁️ Platform & Hesap Bilgileri

| Platform | Detay | Erişim |
|----------|-------|--------|
| **GitHub** | `mobarbilisim/website` | [github.com/mobarbilisim/website](https://github.com/mobarbilisim/website) |
| **Vercel** | `Mustafa's Project (Hobby)` | [vercel.com/dashboard](https://vercel.com/dashboard) |
| **Supabase** | `mobarbilisim` org / `web-site` projesi | [supabase.com/dashboard](https://supabase.com/dashboard) |
| **Turhost** | `mobarbilisim.com` alan adı | [turhost.com](https://turhost.com) |
| **Vercel Subdomain** | `website-two-tau-23.vercel.app` | Otomatik redirect → mobarbilisim.com |

---

## 🗄️ Supabase Veritabanı

### Tablolar
| Tablo | Açıklama |
|-------|----------|
| `categories` | Ürün kategorileri (id, name, created_at) |
| `products` | Ürünler (id, title, price, description, category_id, condition, stock, image_url, created_at) |
| `site_settings` | Anasayfa dinamik içerik — JSON (key: text, value: jsonb) |

### Storage
| Bucket | Erişim | Kullanım |
|--------|--------|----------|
| `images` | Public | Slayt fotoğrafları, ürün görselleri |

---

## 🌐 DNS & Domain Ayarları

**Domain:** `mobarbilisim.com` (Turhost üzerinden yönetiliyor)

| Kayıt | İsim | Değer |
|-------|------|-------|
| A | `@` | `216.198.79.1` (Vercel) |
| CNAME | `www` | `cname.vercel-dns.com` |
| NS | — | `dns1.turhost.com` / `dns2.turhost.com` |

---

## 📌 Önemli Komutlar

```bash
npm run dev      # Geliştirme sunucusu (localhost:3000)
npm run build    # Production build
npm run start    # Production sunucusu
npm run lint     # Kod kalitesi kontrolü
```

---

## ⚠️ Dikkat Edilecekler

1. **`.env.local` dosyasını asla GitHub'a pushlama** — `.gitignore`'da tanımlı ama dikkatli ol.
2. **Her bilgisayarda `.env.local` ayrı oluşturulmalı** — Supabase anahtarları her makinede elle girilmeli.
3. **`git pull` yapmayı unutma** — Farklı bilgisayardan geçiş yaptığında önce `git pull` çek.
4. **Vercel ortam değişkenleri** — `.env.local`'deki tüm anahtarlar Vercel Dashboard > Settings > Environment Variables'a da eklenmiş durumda.
5. **Admin paneli** (`/admin`) — Supabase Auth ile korunuyor. Giriş gerektirir.
