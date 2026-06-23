# 🎾 Web Platform Padel Book

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)

Sebuah platform aplikasi web modern untuk mengelola, mencari jadwal, dan melakukan *booking* (pemesanan) lapangan Padel. Sistem ini dibangun dengan fokus pada kecepatan, keamanan, dan pengalaman pengguna yang luar biasa.

---

## 🚀 Fitur Utama

- **Pencarian & Ketersediaan Lapangan**: Lihat jadwal lapangan Padel yang tersedia secara *real-time*.
- **Sistem Booking Terintegrasi**: Pemesanan lapangan dengan alur yang mudah digunakan.
- **Manajemen Database Relasional**: Menggunakan Prisma ORM dan PostgreSQL untuk menjamin integritas data pesanan.
- **Export/Import Laporan (Excel)**: Fitur pelaporan data (*booking*, transaksi) ke dalam format Excel menggunakan `xlsx`.
- **Desain Modern & Responsif**: Antarmuka yang bersih dibangun dengan **Tailwind CSS v4** dan ikon dari **Lucide React**.

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library UI**: React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

### Backend & Database
- **Database**: PostgreSQL
- **ORM (Object-Relational Mapping)**: Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- **Environment Management**: `dotenv`

---

## 💻 Cara Menjalankan Proyek Secara Lokal

Pastikan komputer Anda sudah terinstal **Node.js** dan **PostgreSQL**. Buka terminal Anda dan jalankan kumpulan perintah di bawah ini secara berurutan:

```bash
# 1. Clone repositori dan masuk ke dalam folder proyek
git clone https://github.com/Muhammad-Nouval-Pro/Web-Platform-Padel-Book.git
cd padel-book

# 2. Install semua dependensi
npm install

# 3. Buat file .env otomatis (Jangan lupa ubah USER, PASSWORD, dan nama DB setelahnya)
echo DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/padel_book_db?schema=public" > .env

# 4. Sinkronisasi skema database dengan Prisma
npx prisma generate
npx prisma db push

# 5. Jalankan server aplikasi
npm run dev

Dibuat dan dikembangkan oleh Muhammad Nouval
