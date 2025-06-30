# Admin Dashboard - AkuCuciin

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

Selamat datang di panel administrasi AkuCuciin! Ini adalah pusat kendali untuk platform **AkuCuciin**, sebuah layanan digital yang mempermudah mahasiswa dalam menggunakan jasa laundry dengan fitur seperti pembayaran online, antar-jemput, dan pembaruan progres laundry secara real-time.

## ✨ Fitur Utama

-   🔹 **Autentikasi Admin:** Proses login yang aman untuk admin menggunakan *JSON Web Token (JWT)*.
-   🔹 **Manajemen Pengguna:** Mengelola data pelanggan dan mitra laundry yang terdaftar.
-   🔹 **Manajemen Status Laundry:** Memperbarui dan melacak status pesanan dari diterima hingga selesai.
-   🔹 **Dashboard Statistik:** Visualisasi data untuk menganalisis performa pesanan dan keuangan.

## 🚀 Teknologi yang Digunakan

-   **[Next.js](https://nextjs.org/)**: Framework React untuk aplikasi web modern dan cepat.
-   **[TypeScript](https://www.typescriptlang.org/)**: Menambahkan tipe data statis untuk kode yang lebih aman dan mudah dikelola.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Kerangka kerja CSS berbasis utility-first untuk desain yang fleksibel.
-   **[shadcn/ui](https://ui.shadcn.com/)**: Kumpulan komponen UI yang dapat disusun ulang, modular, dan aksesibel.

## ⚙️ Memulai Proyek

Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah di bawah ini.

### 1. Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut di komputer Anda:
-   [Node.js](https://nodejs.org/) (v18.x atau lebih baru)
-   [pnpm](https://pnpm.io/installation) (atau npm/yarn)

### 2. Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/mahesgya/admin_nextjs.git](https://github.com/mahesgya/admin_nextjs.git)
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd admin_nextjs
    ```

3.  **Install semua dependency:**
    ```bash
    pnpm install
    ```

4.  **Siapkan Environment Variables:**
    Buat file baru bernama `.env.local` di root proyek dengan menyalin dari `.env.example` (jika ada) atau buat dari awal.
    ```bash
    # .env.local
    JWT_SECRET="ganti-dengan-secret-key-yang-sangat-aman-dan-panjang"
    # Tambahkan variabel lain jika ada (misal: DATABASE_URL)
    ```

5.  **Jalankan server development:**
    ```bash
    pnpm dev
    ```

6.  Buka browser Anda dan kunjungi **http://localhost:3000**.

## 📜 Skrip yang Tersedia

-   `pnpm dev`: Menjalankan aplikasi dalam mode development.
-   `pnpm build`: Membuat production-ready build dari aplikasi.
-   `pnpm start`: Menjalankan server dari production build.
-   `pnpm lint`: Menjalankan linter untuk memeriksa kualitas kode.


## 📚 Dokumentasi Tambahan
- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Dokumentasi Tailwind CSS](https://tailwindcss.com/docs)
- [Dokumentasi shadcn/ui](https://ui.shadcn.com/docs)


---
**© 2025 AkuCuciin. All Rights Reserved.**
