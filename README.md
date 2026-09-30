# Media Prima Berhad — Employee Overtime Portal (Remix OT Tracker)

> **Sistem Pengurusan & Audit Masa Lebih Masa Kakitangan**  
> Enterprise Overtime Tracking, Compliance Monitoring, and 7th-Cutoff Payroll Reconciliation Portal for Media Prima Berhad (MPB).

---

### 🌐 Pautan Rasmi Aplikasi (Official Live Portal URL)

| Perkara / Item | Butiran / Details |
|---|---|
| **Pautan Langsung (Live URL)** | **[https://ottracker.ai.studio](https://ottracker.ai.studio)** |
| **Akses Terus (Direct Link)** | <https://ottracker.ai.studio> |
| **Salin URL (Copy URL)** | `https://ottracker.ai.studio` |
| **Penyedia Awan (Cloud Host)** | Google Cloud Run • `asia-southeast1` |
| **Pangkalan Data (Database)** | Google Cloud Firestore Live |

```text
https://ottracker.ai.studio
```

---

[![Pautan Rasmi](https://img.shields.io/badge/Pautan_Rasmi-ottracker.ai.studio-0284C7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ottracker.ai.studio)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Cloud](https://img.shields.io/badge/GCP_Region-asia--southeast1-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![Authentication](https://img.shields.io/badge/Auth-Mandatory%20Staff%20Login-10B981)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Internal-red.svg)](LICENSE)

---

## 📌 Ringkasan Eksekutif / Executive Summary

**Media Prima Berhad — Employee Overtime Portal** adalah aplikasi web korporat gred produksi yang dibina khas bagi menguruskan log masa lebih masa (OT) harian, memantau kuota statutori di bawah **Akta Kerja 1955**, dan menyelaraskan penutupan rekod penggajian sebelum **tarikh akhir 7hb setiap bulan**.

Aplikasi ini kini diperkukuh dengan:
1. **Pintu Masuk Keselamatan Wajib (Mandatory Staff Login & Logout Gate)**: Menghendaki setiap staf atau pentadbir log masuk secara sah sebelum sebarang rekod kerja lebih masa boleh diakses atau diubah suai, serta butang **Log Keluar** khusus untuk menamatkan sesi dengan selamat.
2. **Pangkalan Data Cloud Langsung (Google Cloud Firestore - `asia-southeast1`)**: Integrasi penuh awan Firebase Firestore dengan sokongan penyegerakan dwi-arah secara masa nyata.
3. **Pelbagai Pilihan Log Masuk Staf**: Pengesahan akaun Google (Firebase Auth), No. ID Staf Korporat / Emel dengan pilihan jabatan, serta akses pantas profil staf demo.

---

## ✨ Ciri-Ciri Utama & Kemas Kini Terkini (Key Capabilities & Updates)

### 1. 🚪 Pintu Log Masuk & Log Keluar Kakitangan Wajib (Staff Login & Logout Flow)
* **Akses Dilindungi Sepenuhnya**: Pengguna tidak dibenarkan mengakses dashboard, menambah entri OT, atau menyemak laporan selagi belum log masuk.
* **Tiga Kaedah Log Masuk Fleksibel**:
  1. **Google Account / Firebase Cloud**: Log masuk dengan 1-klik menggunakan akaun Google untuk menyegerakkan data terus ke pangkalan data cloud.
  2. **Staff ID & Emel Korporat**: Log masuk dengan mengisi Nama Penuh Staf, No. ID Staf (cth: `STF-1042`), Jabatan (Kejuruteraan & IT, Penyiaran Berita TV3, Operasi Gudang, dsb.), dan Kata Laluan/PIN Staf.
  3. **Pilihan Staf Pantas (1-Klik)**: Profil siap sedia kakitangan seperti **Ahmad Razak (STF-1042)**, **Elena Rostova (EMP-10493)**, **Siti Nurhaliza (STF-3012)**, dan **Asward (DIR-881 - Admin)**.
* **Fungsi Log Keluar Terpelihara (Clear Staff Logout)**:
  * Butang **Log Keluar (Logout)** merah berprofil tinggi sentiasa dipaparkan pada bar navigasi atas (**Header**) bersebelahan maklumat staf.
  * Butang **Log Keluar** pantas juga dipaparkan pada kad maklumat staf dalam **Papan Pemuka Staf** dan konsol **Pemantauan Admin**.
  * Apabila staf menekan log keluar, sesi ditamatkan serta-merta, data sesi tempatan dikosongkan, akaun Firebase dilog keluar, dan sistem kembali ke skrin log masuk dengan pemberitahuan toast rasmi.

### 2. 🗄️ Sambungan Pangkalan Data Awan (Google Cloud Firestore Live)
* **Pangkalan Data Khusus**: `ai-studio-remixottrackerem-1f741ceb-2385-4f72-88bf-bb840cf1ce8b` di wilayah `asia-southeast1`.
* **Penyegerakan Masa Nyata (Real-Time Sync)**:
  * Entri lebih masa (`/overtimeEntries`) disegerakkan terus ke cloud bagi setiap operasi tambah, sunting, dan padam.
  * Ringkasan tuntutan bulanan (`/monthlySubmissions`) dikemas kini secara langsung ke konsol pengauditan HR.
* **Tetingkap Status & Diagnostik Pangkalan Data (`DatabaseStatusModal`)**:
  * **Ujian Latensi (Ping Test)**: Mengukur kelajuan sambungan ke Firestore secara langsung dalam milisaat (ms).
  * **Segerak Data Awal (Sync Initial Data)**: Alat 1-klik untuk memuat naik dan menyemak data kakitangan dan tuntutan permulaan ke pangkalan data cloud.
  * **Penunjuk Status Langsung**: Butang penunjuk sambungan langsung hijau (`Database: Live`) dipaparkan pada **Header** dan **Simulation Bar**.

### 3. 🕒 Log Masa Lebih Masa Kakitangan (Staff OT Timesheet)
* **Borang Pantas**: Tarikh, masa mula/tamat, tempoh automatik, pemilihan kod projek/siaran MPB, serta justifikasi kerja.
* **Penyuntingan & Pemadaman Pantas**: Antara muka responsif dengan kalkulator jam kumulatif dan anggaran pampasan.
* **Penghantaran Tuntutan Bulanan**: Kunci lembaran kerja dan serahkan ke bahagian HR sebelum tarikh akhir 7hb.

### 4. ⚖️ Tolok Pematuhan Akta Kerja 1955 (Statutory Quota Gauge)
* **Had Statutori 104 Jam**: Tolok visual dan lencana status memantau had undang-undang buruh Malaysia setiap bulan.
* **Zon Amaran Berperingkat**:
  * 🟢 **Zon Selamat (< 70 jam)**: Kapasiti operasi biasa.
  * 🟡 **Zon Berwaspada (70 – 90 jam)**: Amaran awal untuk pengurus bahagian.
  * 🔴 **Zon Kritikal (> 90 jam)**: Amaran sekatan bagi mengelakkan perlanggaran statutori undang-undang.

### 5. 🗓️ Bar Simulasi Tarikh Akhir 7hb (Payroll Cutoff Simulator)
* Uji tingkah laku sistem merentasi fasa kitaran gaji:
  * **3hb (Awal Kitaran)**: Fasa pengisian entri biasa.
  * **7hb (Tarikh Akhir ⚠️)**: Status amaran penting — tuntutan perlu dihantar sebelum 23:59 GMT+8.
  * **9hb (Tempoh Ihsan / Kunci)**: Semakan khas ketua jabatan dan kelulusan lewat.
  * **14hb (Pasca-Cutoff / Terkunci)**: Kunci rekod bagi proses penggajian finance.

### 6. 🛡️ Papan Pemuka Audit & Pemantauan Pentadbir (HR Monitoring)
* **Status Kakitangan Seluruh Syarikat**: Pantau status *Submitted* atau *Pending* merentasi Jabatan Kejuruteraan, Logistik, Gudang, dan Kawalan Dispatch.
* **Peringatan 1-Klik**: Hantar notifikasi segera kepada kakitangan yang masih belum menghantar log OT.
* **Jejak Audit Terperinci**: Lihat pecahan jam, kod siaran/projek, dan sahkan rekod untuk eksport CSV penggajian.

### 7. 🌐 Dwi-Bahasa & Mod Cerah/Gelap Korporat
* **Bahasa Malaysia 🇲🇾 & English 🇬🇧**: Pertukaran bahasa serta-merta pada bila-bila masa.
* **Mod Gelap (Dark Mode)**: Skema warna korporat berkontras tinggi dengan simpanan konfigurasi setempat.

---

## 🛠️ Senibina Teknologi (Technology Stack)

| Lapisan / Komponen | Teknologi & Servis |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Pangkalan Data Cloud** | [Google Cloud Firestore](https://firebase.google.com/docs/firestore) (`asia-southeast1`) |
| **ID Pangkalan Data** | `ai-studio-remixottrackerem-1f741ceb-2385-4f72-88bf-bb840cf1ce8b` |
| **Pengesahan Pengguna** | [Firebase Authentication](https://firebase.google.com/docs/auth) (Google OAuth) + Staff Session Gate |
| **Alat Binaan & Pelayan** | [Vite 8](https://vitejs.dev/) + [Express](https://expressjs.com/) (Node.js) |
| **Gaya & Rekaan UI** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Ikon & Tipografi** | [Lucide React](https://lucide.dev/), [Material Symbols](https://fonts.google.com/icons), *Plus Jakarta Sans* & *Inter* |
| **Animasi & Interaksi** | [Motion](https://motion.dev/) (Framer Motion v12) |
| **Keselamatan & ABAC** | Peraturan Ketat `firestore.rules` (Pola Master Gate & Anti-Update-Gap) |

---

## 📂 Struktur Direktori Projek (Project Directory Structure)

```
├── .env.example                  # Templat pembolehubah persekitaran
├── firebase-applet-config.json   # Konfigurasi kelayakan & ID Firestore
├── firebase-blueprint.json       # Pelan skema entiti perantara (Intermediate Representation)
├── firestore.rules               # Peraturan keselamatan Firestore gred Zero-Trust
├── security_spec.md              # Spesifikasi keselamatan & senarai ancaman (Dirty Dozen)
├── index.html                    # Titik masuk HTML & fon Google Web
├── metadata.json                 # Spesifikasi applet AI Studio & kebenaran
├── package.json                  # Pakej kebergantungan & skrip projek
├── tsconfig.json                 # Konfigurasi pengkompil TypeScript
├── vite.config.ts                # Konfigurasi plugin Vite & Tailwind v4
├── public/
│   ├── media-prima-logo.svg      # Logo vektor rasmi Media Prima Berhad
│   └── asward-profile.jpg        # Foto profil pengaudit HR
└── src/
    ├── main.tsx                  # Titik mula React disalut dengan FirebaseProvider
    ├── App.tsx                   # Routing, pengesahan sesi, Firestore sync & logout flow
    ├── firebase.ts               # Inisialisasi SDK Firebase, ujian sambungan & CRUD
    ├── index.css                 # Pembolehubah tema Tailwind v4 & gaya mod gelap
    ├── types.ts                  # Definisi jenis data TypeScript & sesi staf
    ├── mockData.ts               # Data demo permulaan kakitangan & katalog projek
    ├── context/
    │   └── FirebaseContext.tsx   # Pembekal konteks auth Firebase & profil pengguna
    └── components/
        ├── Header.tsx                 # Bar navigasi utama, profil staf & butang Log Keluar
        ├── SimulationBar.tsx          # Bar kawalan simulasi tarikh 7hb & status cloud
        ├── DatabaseStatusModal.tsx    # Modal diagnostik: ping test & segerak data Firestore
        ├── MediaPrimaLogo.tsx         # Komponen paparan logo jenama Media Prima
        ├── StaffDashboard.tsx         # Papan pemuka pengisian log masa lebih masa & log keluar
        ├── QuotaGauge.tsx             # Tolok statutori Akta Kerja 1955 (104 jam)
        ├── CalendarView.tsx           # Paparan kalendar anjakan masa lebih masa
        ├── AdminMonitoring.tsx        # Konsol pemantauan status penghantaran staf & admin logout
        ├── ClaimReviewPage.tsx        # Halaman semakan dan pengesahan baucar tuntutan
        ├── ReportsPage.tsx            # Analisis carta jabatan & unjuran kos OT
        ├── StaffDirectoryPage.tsx     # Direktori kakitangan syarikat
        ├── LoginPage.tsx              # Pintu masuk login staf: Google Auth, ID Staf, & Demo
        ├── EditEntryModal.tsx         # Modal suntingan rekod entri OT
        ├── AuditDetailModal.tsx       # Modal perincian log audit staf
        ├── StatusStepper.tsx          # Penunjuk langkah proses tuntutan
        └── Toast.tsx                  # Notifikasi animasi tindakan pengguna
```

---

## 🚀 Panduan Memulakan Projek (Getting Started)

### 🌐 Akses Terus Dalam Talian (Instant Live Access)
Aplikasi portal ini boleh dilayari secara terus tanpa memerlukan sebarang pemasangan lokal melalui pautan rasmi:  
👉 **[https://ottracker.ai.studio](https://ottracker.ai.studio)**

### Keperluan Sistem (Untuk Pembangunan Tempatan)
- **Node.js**: v18.0.0 atau lebih baharu (Node 20+ disyorkan)
- **npm**: v9.0.0 atau lebih baharu

### Langkah Pemasangan & Pelaksanaan Lokal
1. **Klon repositori:**
   ```bash
   git clone https://github.com/<nama-pengguna>/remix-ot-tracker-mpb.git
   cd remix-ot-tracker-mpb
   ```

2. **Pasang pakej kebergantungan (Dependencies):**
   ```bash
   npm install
   ```

3. **Jalankan pelayan pembangunan (Development Server):**
   ```bash
   npm run dev
   ```
   Aplikasi boleh diakses melalui pelayar di: `http://localhost:3000`

---

## 📜 Skrip NPM yang Disediakan

| Arahan | Fungsi |
|---|---|
| `npm run dev` | Menjalankan pelayan pembangunan Vite pada port 3000 (`0.0.0.0`) |
| `npm run build` | Mengkompil TypeScript dan membina fail produksi dalam folder `dist/` |
| `npm run preview` | Menguji binaan produksi secara lokal |
| `npm run lint` | Menjalankan semakan ralat TypeScript tanpa menjana fail (`tsc --noEmit`) |
| `npm run clean` | Memadam fail binaan lama `dist/` |

---

## 🏢 Peraturan Syarikat & Dasar Pematuhan Undang-Undang

### 1. Peraturan Cutoff Penggajian 7hb
- Semua tuntutan kerja lebih masa bagi bulan terdahulu mestilah dihantar dan diluluskan selewat-lewatnya pada **23:59, 7hb bulan semasa**.
- Tuntutan selepas 7hb memerlukan pengesahan khas daripada Ketua Jabatan (HOD) dan Bahagian Sumber Manusia Kumpulan (Group HR).

### 2. Akta Kerja 1955 (Seksyen 60A)
- Had maksimum kerja lebih masa pekerja dihadkan kepada **104 jam sebulan**.
- Sistem menyekat dan memberi amaran merah sekiranya pekerja mendekati atau melebihi had kuota statutori ini.

### 3. Kadar Kiraan Lebih Masa (Polisi Media Prima Berhad)
- **Hari Bekerja Biasa (Normal Day)**: 1.5× Kadar Sejam Gaji Pokok (HRP)
- **Hari Rehat (Rest Day)**: 2.0× Kadar Sejam Gaji Pokok (HRP)
- **Hari Kelepasan Am (Public Holiday)**: 3.0× Kadar Sejam Gaji Pokok (HRP)

---

## 👥 Hak Akses & Peranan Pengguna (RBAC)

* **Kakitangan / Kru Siaran (`staff`)**:
  * Mesti log masuk sebelum dapat mengakses lembaran masa peribadi.
  * Mengisi, menyunting, dan memadam rekod OT harian.
  * Memantau tolok kuota 104 jam peribadi.
  * Menghantar tuntutan bulanan rasmi sebelum 7hb.
  * Log keluar dengan selamat setelah selesai.
* **Pengaudit HR / Pentadbir (`admin`)**:
  * Mengakses papan pemuka audit seluruh cawangan dan jabatan.
  * Mengirim notifikasi peringatan pantas kepada staf yang belum selesai.
  * Meluluskan atau mengesahkan baucar tuntutan kakitangan.
  * Mengeksport lembaran rekod ke fail CSV Penggajian.
  * Log keluar pentadbir apabila tugas pemantauan selesai.

---

## 📄 Lesen & Hak Cipta

Perisian dalaman korporat hak milik **Media Prima Berhad**. Hak cipta terpelihara.  
Sebarang penyalinan, pengubahsuaian, atau pengedaran tanpa kebenaran bertulis adalah dilarang sama sekali.
