# Mazashields — Frontend

Antarmuka pengguna Mazashi Livestock Distribution System, dibangun dengan **Next.js** dan di-deploy di **Vercel**.

🌐 **Live:** https://mazashield-frontend.vercel.app  
🔗 **Backend API:** https://mazashield-backend-production.up.railway.app

---

## Tim Pengembang

**Kelompok AdalahPokoknya** — Client: PT Mazashi Semuda Farm

| Nama | NPM |
|------|-----|
| Alfian Bassam Firjatullah | 2306212695 |
| Mawla Raditya Pambudi | 2306275323 |
| Regina Meilani Aruan | 2306275632 |
| Rosanne Valerie | 2306222986 |
| Sezza Auraghaniya Winanda | 2306207291 |

---

## Struktur Direktori

```
mazashield-frontend/
├── app/                    # Next.js App Router
│   ├── (external)/         # Halaman publik (customer)
│   ├── (internal)/         # Halaman admin/internal
│   └── login/              # Halaman login
├── components/             # Komponen reusable
├── lib/                    # Utilities & API client
├── public/                 # Aset statis
├── .env.example            # Template environment variables
├── next.config.js
└── package.json
```

---

## Prasyarat

- Node.js v18+
- npm

---

## Instalasi & Menjalankan Lokal

```bash
# 1. Clone repo
git clone <url-repo-frontend>
cd mazashield-frontend

# 2. Install dependencies
npm install

# 3. Konfigurasi environment variables
cp .env.example .env.local
```

Isi `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# 4. Jalankan dev server
npm run dev
```

Akses di: **http://localhost:3000**

---

## Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

---

## Branching Strategy

| Branch | Fungsi |
|--------|--------|
| `main` | Production |
| `staging` | Pre-production |
| `development` | Integrasi fitur |
| `feat/<nama>` | Branch individu |

Alur: `feat/<nama>` → `development` → `staging` → `main`

---

## Deployment

Deploy otomatis ke Vercel setiap push ke branch `main`. Set environment variables di Vercel Dashboard sesuai `.env.example`.