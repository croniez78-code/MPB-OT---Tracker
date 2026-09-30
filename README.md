# Media Prima Berhad — Employee Overtime Portal (Remix OT Tracker)

> **Sistem Pengurusan & Audit Masa Lebih Masa Kakitangan**  
> Enterprise Overtime Tracking, Compliance Monitoring, and 7th-Cutoff Payroll Reconciliation Portal for Media Prima Berhad (MPB).

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary%20%2F%20Internal-red.svg)](LICENSE)

---

## 📌 Executive Summary

**Media Prima Berhad — Employee Overtime Portal** is a production-grade enterprise web application designed to streamline daily overtime (OT) logging, eliminate payroll submission bottlenecks, and ensure strict compliance with the **Malaysian Employment Act 1955 (Akta Kerja 1955)** regarding statutory overtime limits.

The portal provides an intuitive self-service timesheet for broadcast, engineering, and logistics crew, paired with an executive monitoring cockpit for HR personnel and Department Heads before the critical **7th-of-the-month payroll cutoff deadline**.

---

## ✨ Key Capabilities

### 1. 🕒 Self-Service Staff Overtime Logging
- **Fast Entry Capture**: Record date, shift start/end timestamps, duration, associated production/broadcast project codes, and justification notes.
- **Editable Timesheet**: Add, update, or remove entries in real time with automatic hour summation and claim breakdown.
- **Submission Workflow**: Lock and submit the monthly claim directly to HR with automated submission timestamps.

### 2. ⚖️ Statutory Labor Law Compliance Gauge (Akta Kerja 1955)
- **104-Hour Quota Monitoring**: Real-time visual gauge and badge indicators tracking monthly overtime against Malaysia's statutory 104-hour overtime ceiling.
- **Dynamic Risk Categorization**:
  - 🟢 **Safe Zone (< 70 hrs)**: Normal operational buffer.
  - 🟡 **Caution Zone (70 – 90 hrs)**: Early alert threshold for department managers.
  - 🔴 **Critical Zone (> 90 hrs)**: High-risk breach warnings to prevent legal non-compliance.

### 3. 🗓️ 7th-Cutoff Payroll Timeline Simulator
- Test application behavior across different monthly cutoff lifecycle stages:
  - **Day 3 (Pre-Cutoff)**: Normal logging phase; staff enter daily shifts.
  - **Day 7 (Cutoff Deadline)**: Urgent reminder status; pending claims must be signed off by 23:59 GMT+8.
  - **Day 9 (Grace Period)**: Grace period for manager reviews and late justifications.
  - **Day 14 (Post-Cutoff / Locked)**: Timesheet locked for finance & payroll processing.

### 4. 🛡️ Management & HR Admin Monitoring Dashboard
- **Department-Wide Reconciliation**: Real-time tracking of staff submission states across *Engineering*, *Warehouse Hub B*, *Fleet Logistics*, and *Dispatch Control*.
- **1-Click Reminders**: Dispatch instant submission reminder notifications to pending staff members.
- **Detailed Audit Trail**: Inspect individual staff entries, breakdown by project codes, and view approval status.

### 5. 📊 Departmental Analytics & Reports
- Aggregated monthly overtime distributions across business units.
- Cost projections, peak overtime operational days, and staffing workload analysis.

### 6. 🌐 Bilingual & Accessibility Ready
- **Full Bilingual Localization**: Instant toggle between **Bahasa Malaysia (BM)** and **English (EN)**.
- **Corporate Dark / Light Mode**: High-contrast, WCAG-conscious corporate theme palette with persistent preference storage.
- **Responsive Layout**: Optimized for mobile field crews, tablet supervisors, and desktop HR administrators.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react` |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), [Material Symbols Outlined](https://fonts.google.com/icons), *Inter* & *Plus Jakarta Sans* |
| **Animations** | [Motion](https://motion.dev/) (Framer Motion v12) |
| **Backend Integration** | [Express](https://expressjs.com/) (Node.js) server integration |
| **Persistence** | Synchronized Browser `localStorage` (Offline-first resilient) |

---

## 📂 Project Architecture

```
├── .env.example              # Environment variables template
├── index.html                # Application HTML entry point & font preconnects
├── metadata.json             # AI Studio applet specifications & capabilities
├── package.json              # Dependencies and lifecycle scripts
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite configuration with Tailwind CSS v4 plugin
├── public/
│   ├── media-prima-logo.svg  # Media Prima Berhad official vector insignia
│   └── asward-profile.jpg    # Staff profile portrait asset
└── src/
    ├── main.tsx              # React DOM mounting entry point
    ├── App.tsx               # Root component: state management, routing & persistence
    ├── index.css             # Tailwind v4 theme variables & custom utilities
    ├── types.ts              # Core TypeScript interfaces & domain models
    ├── mockData.ts           # Initial seeded staff records & project catalog
    └── components/
        ├── Header.tsx             # Global navigation bar, role switch & language switcher
        ├── MediaPrimaLogo.tsx     # Brand logo renderer
        ├── SimulationBar.tsx      # 7th-cutoff payroll timeline simulation controller
        ├── StaffDashboard.tsx     # Employee daily OT entry & timesheet view
        ├── QuotaGauge.tsx         # 104-hour statutory legal compliance circular gauge
        ├── CalendarView.tsx       # Calendar grid view of logged overtime shifts
        ├── AdminMonitoring.tsx    # HR supervisor monitoring cockpit & batch actions
        ├── ClaimReviewPage.tsx    # Individual & batch claim review workflow
        ├── ReportsPage.tsx        # Departmental analytics, breakdown & cost charts
        ├── StaffDirectoryPage.tsx # Master staff directory with contact & OT summary
        ├── LoginPage.tsx          # Multi-role authentication & quick switch dialog
        ├── EditEntryModal.tsx     # Modal form for modifying existing OT records
        ├── AuditDetailModal.tsx   # Detailed claim inspection & audit log modal
        ├── StatusStepper.tsx      # Multi-step progress indicator for claim processing
        └── Toast.tsx              # Animated feedback & action notifications
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm**: v9.0.0 or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/remix-ot-tracker-mpb.git
   cd remix-ot-tracker-mpb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   ```bash
   cp .env.example .env
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:3000`

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Vite development server on port 3000 (`0.0.0.0`) |
| `npm run build` | Compiles TypeScript and creates optimized production assets in `dist/` |
| `npm run preview` | Locally serves the production build for testing |
| `npm run lint` | Runs TypeScript compiler checks without emitting code (`tsc --noEmit`) |
| `npm run clean` | Cleans previous build artifacts |

---

## 🏢 Business Rules & Compliance Logic

### 1. 7th-Cutoff Payroll Rule
- All overtime rendered between the **1st and the final day of the previous calendar month** must be submitted and approved by **23:59 on the 7th of the current month**.
- Claims submitted after the 7th without prior HOD authorization are automatically flagged for escalation to Group Human Resources.

### 2. Malaysian Employment Act 1955 (Section 60A)
- Maximum allowable overtime is capped at **104 hours per month**.
- Any scheduled overtime exceeding this limit requires statutory labor department dispensation.

### 3. Claim Rate Multipliers (Standard MPB Policy)
- **Normal Working Day**: 1.5× Hourly Rate of Pay (HRP)
- **Rest Day**: 2.0× Hourly Rate of Pay (HRP)
- **Public Holiday**: 3.0× Hourly Rate of Pay (HRP)

---

## 👥 Roles & Permissions

- **Staff / Crew Member (`staff`)**:
  - View personal monthly quota and entries.
  - Log, edit, and delete draft overtime entries.
  - Submit monthly overtime report before the 7th.
- **Supervisor / HR Admin (`admin`)**:
  - View organization-wide reconciliation status.
  - Send direct reminders to non-compliant staff.
  - Review, approve, or reject submitted overtime claims.
  - Export audit logs and departmental summaries.

---

## 📄 License & Confidentiality

Internal corporate software developed for **Media Prima Berhad**. All rights reserved.  
Unauthorized copying, modification, distribution, or public display without prior written permission is strictly prohibited.
