# DesaHub Frontend

Frontend aplikasi **DesaHub** — platform digital desa untuk administrasi, layanan warga, dan marketplace UMKM lokal. Proyek ini dibangun dengan **Next.js App Router** dan terhubung ke backend Laravel melalui IAM service.

## Tech Stack

### Core

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| [Next.js](https://nextjs.org/) | 16.x | App Router, SSR/SSG |
| [React](https://react.dev/) | 19.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first styling |

### UI & Komponen

| Paket | Kegunaan |
|-------|----------|
| `@radix-ui/react-select` | Komponen select yang accessible |
| `lucide-react` | Ikon |
| `tailwind-merge` | Merge class Tailwind |
| `@tailwindcss/forms` | Styling form default |
| `@svgr/webpack` | Import SVG sebagai React component |
| Google Font **Outfit** | Font utama aplikasi |

### Data & Interaksi

| Paket | Kegunaan |
|-------|----------|
| `apexcharts` + `react-apexcharts` | Grafik dashboard admin |
| `@fullcalendar/*` | Kalender |
| `flatpickr` | Date picker |
| `@react-jvectormap/*` | Peta interaktif |
| `swiper` | Carousel / slider |
| `react-dnd` + `react-dropzone` | Drag-and-drop & upload file |

### Tooling

| Paket | Kegunaan |
|-------|----------|
| ESLint + `eslint-config-next` | Linting |
| PostCSS + Autoprefixer | CSS processing |

## Prasyarat

- **Node.js** 18.x atau lebih baru (disarankan 20.x+)
- **npm** (atau yarn/pnpm)
- Backend Laravel DesaHub berjalan (untuk fitur auth & API)

## Setup

### 1. Clone repository

```bash
git clone <url-repo-desahub-fe>
cd desahub-fe
```

### 2. Install dependensi

```bash
npm install
```

> Jika muncul error peer dependency, coba: `npm install --legacy-peer-deps`

### 3. Konfigurasi environment

Salin file contoh environment lalu sesuaikan nilainya:

```bash
cp .env.example .env
```

| Variabel | Deskripsi |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | Base URL backend Laravel (tanpa trailing slash), contoh: `http://127.0.0.1:8000` |

Prefix route tiap service API dikelola di `src/config/api-prefixes.ts` (bukan di `.env`).

### 4. Jalankan development server

```bash
npm run dev
```

Aplikasi tersedia di [http://localhost:3000](http://localhost:3000).

## Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Cek kode dengan ESLint |

## Struktur Aplikasi

Proyek menggunakan **route groups** Next.js App Router:

```
src/
├── app/
│   ├── (admin)/              # Dashboard admin desa
│   ├── (customer)/           # Halaman publik / warga
│   │   └── marketplace-umkm/ # Marketplace UMKM
│   └── (full-width-pages)/   # Auth (login, register)
├── components/               # Komponen UI
├── config/                   # Konfigurasi menu & env
├── context/                  # React context (cart, theme, sidebar)
├── hooks/                    # Custom hooks
├── layout/                   # Layout admin (sidebar, header)
├── lib/                      # Utility & API client
├── services/                 # Service layer (auth, role)
└── types/                    # TypeScript types
```