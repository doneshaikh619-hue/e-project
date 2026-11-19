# WatchHub — Luxury Watch Shopping Mobile & Web Platform
> **Aptech Final eProject (Senior Developer Edition)**  
> Built with React 18, Vite, Tailwind CSS, Framer Motion, Express.js & SQLite Database.

---

## 🌟 Key Features
- **Haute Horlogerie UI/UX:** High-end aesthetic designed with 21st.dev luxury design patterns, glassmorphic dark theme, brushed gold metallic accents, and silky smooth micro-interactions.
- **Dual Mode Simulator:** Toggle between **Full Desktop Portal** and **3D iPhone 16 Pro Mobile App Simulator** with one click.
- **Interactive 360° Studio:** Real-time 3D perspective rotation, auto-rotation toggle, light-angle reflection, and optical loupe precision zoom lens.
- **Master Catalog:** Multi-facet filtering by Maison/Brand, Category, Price Range Slider, Gender, In-Stock status, and instant autocomplete search.
- **Detailed Horology Dossier:** Full 8-point specifications, live stock indicators, client reviews, and rating submission.
- **Shopping Cart & Voucher Engine:** Slide-over drawer and dedicated page with real-time promo discounts (`WATCHVIP10`, `LUXURY500`, `ROYAL20`).
- **White-Glove Checkout:** Interactive Black Card preview, Swiss wire transfer, Bitcoin escrow, confetti celebration, and instant order tracking generation.
- **User Profile & Tracking:** Past order history with interactive live radar delivery timeline.
- **24/7 VIP Concierge:** In-app AI chatbot assistant, searchable FAQ accordion, and inquiry contact form.
- **Executive Admin Suite:** Full Product Catalog CRUD (Add/Edit/Delete), Order Status workflow, Review moderation, and financial KPI analytics.

---

## 🚀 How to Run the Project

### Option A: Double-Click (Windows)
Simply double-click `start.bat` in the project root directory.

### Option B: Terminal Command
```bash
# 1. Open terminal in this folder
cd watchhub-luxury-ecommerce

# 2. Run both backend and frontend together
npm start
```

### URLs:
- **Frontend Portal:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Login Credentials for Evaluators

| Role | Email | Password | Quick Login |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@watchhub.luxury` | `admin123` | Click `👑 Admin (Henri Stern)` on Sign-In page |
| **VIP Client** | `client@watchhub.luxury` | `user123` | Click `👤 Client (Arthur)` on Sign-In page |

---

## 📁 Project Structure
```
watchhub-luxury-ecommerce/
├── index.html                   # HTML entry with luxury typography
├── package.json                 # Project dependencies and scripts
├── vite.config.js               # Vite configuration with API proxy
├── tailwind.config.js           # Custom luxury gold and onyx theme palette
├── start.bat                    # 1-click Windows launcher
├── PROJECT_DOCUMENTATION.md     # Complete Aptech project report & test matrix
├── server/
│   ├── index.js                 # Express REST API server
│   ├── db.js                    # Database storage engine
│   ├── seedData.js              # 16+ luxury timepieces, reviews & initial data
│   └── watchhub_database.sql    # Relational SQL schema & sample queries
└── src/
    ├── main.jsx                 # React root
    ├── App.jsx                  # Main application router and providers
    ├── index.css                # Tailwind directives & luxury styling
    ├── context/                 # Auth, Cart, Wishlist, UI state management
    ├── components/              # 360 Studio, Loupe, Bento, Navbar, Footer, Chat
    ├── pages/                   # 11 full pages required by the eProject doc
    └── utils/                   # REST API client & currency formatters
```
