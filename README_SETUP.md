# ⚛️ Frontend Admin - NMSuperMarket Admin Dashboard

Admin dashboard của dự án NMSuperMarket xây dựng bằng **React 19** + **Vite** + **Tailwind CSS** + **Chart.js**.

---

## ⚡ Quick Start

```bash
# 1. Cài dependencies
npm install

# 2. Copy .env
copy .env.example .env

# 3. Chạy development server
npm run dev

# Truy cập: http://localhost:5173
```

---

## 📦 Yêu Cầu

- **Node.js**: 18+
- **npm**: 9+

---

## 🛠️ Cài Đặt Chi Tiết

### 1. Cài Đặt NPM Dependencies

```bash
npm install
```

**Điều này sẽ:**
- Tải về tất cả packages
- Tạo folder `node_modules/`
- Tạo file `package-lock.json`

### 2. Cấu Hình Environment

```bash
copy .env.example .env
```

**Cấu hình .env:**
```env
# API Backend URL
VITE_API_URL=http://localhost:8000/api
```

### 3. Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:5173**

- Tự động reload khi code thay đổi
- Bảng lỗi hiển thị trực tiếp trong browser

---

## 🚀 Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

**Kết quả:** Folder `dist/` chứa tệp tối ưu hóa

### Preview Production Build

```bash
npm run preview
```

Xem production build trước khi deploy

---

## 📁 Cấu Trúc Dự Án

```
FE_Admin_NMSuperMarket/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   ├── Orders/
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── OrdersPage.jsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── store/                   # Zustand state management
│   ├── App.jsx                  # Root component
│   └── main.jsx                 # Entry point
├── public/                      # Static assets
├── dist/                        # Build output (sau npm run build)
├── .env                         # Environment variables
├── .env.example                 # Example .env
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies
├── package-lock.json           # Lock file
└── index.html                  # HTML entry point
```

---

## 📚 Thư Viện Chính

### Dependencies (Runtime)

```json
{
  "react": "^19.2.5",            // UI Framework
  "react-dom": "^19.2.5",        // React DOM
  "react-router-dom": "^7.15.0", // Routing
  "axios": "^1.16.0",            // HTTP requests
  "zustand": "^5.0.13",          // State management
  "chart.js": "^4.5.1",          // Charts
  "react-chartjs-2": "^5.3.1",   // React Chart wrapper
  "recharts": "^3.8.1",          // Alternative charts
  "lucide-react": "^1.16.0",     // Icons
  "tailwindcss": "^4.2.4"        // Styling
}
```

### DevDependencies

```json
{
  "vite": "^8.0.10",
  "@vitejs/plugin-react": "^6.0.1",
  "@tailwindcss/vite": "^4.2.4",
  "eslint": "^10.2.1"
}
```

---

## 🎨 Styling (Tailwind CSS)

Dự án sử dụng **Tailwind CSS** cho styling:

```jsx
<div className="flex items-center justify-between p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">Dashboard</h1>
</div>
```

**Tailwind CLI commands:**
```bash
# Nếu cần chỉnh Tailwind config
# Mở: tailwind.config.js
```

---

## 🗂️ State Management (Zustand)

Sử dụng **Zustand** để quản lý state toàn ứng dụng.

**Ví dụ:**
```javascript
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## 🌐 API Communication (Axios)

HTTP requests được handle bằng **Axios**:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📊 Charts (Chart.js & Recharts)

### Chart.js Example
```jsx
import { Chart as ChartJS } from 'chart.js';
import { Bar } from 'react-chartjs-2';

<Bar data={chartData} />
```

### Recharts Example
```jsx
import { BarChart, Bar } from 'recharts';

<BarChart data={data}>
  <Bar dataKey="value" />
</BarChart>
```

---

## 📖 Các Lệnh Hữu Ích

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Install package
npm install package-name

# Uninstall package
npm uninstall package-name

# Update all packages
npm update

# Check outdated packages
npm outdated
```

---

## 🔗 Routing (React Router)

Routes được định nghĩa trong `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/products" element={<ProductsPage />} />
  <Route path="/orders" element={<OrdersPage />} />
</Routes>
```

---

## 🔐 Authentication

**Header:**
```
Authorization: Bearer {token}
```

**Cách lưu token:**
```javascript
localStorage.setItem('token', token);

// Lấy token
const token = localStorage.getItem('token');
```

---

## 🐛 Troubleshooting

### 1. "Port 5173 already in use"
```bash
npm run dev -- --port 5175
```

### 2. "Cannot find module"
```bash
npm install
```

### 3. "CORS error"
- Kiểm tra Backend đang chạy
- Kiểm tra VITE_API_URL trong .env

### 4. "Module not found: 'react'"
```bash
npm cache clean --force
npm install
```

---

## 🌟 Best Practices

1. **Components:** Giữ components nhỏ và tái sử dụng
2. **State:** Sử dụng Zustand cho global state
3. **API:** Tạo utility functions cho API calls
4. **Styling:** Dùng Tailwind classes thay vì CSS files
5. **Performance:** Lazy load components khi cần

---

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🚢 Deployment

### Build cho Production

```bash
npm run build
```

### Upload `dist/` folder lên server

Folder `dist/` chứa tất cả tệp static ready to deploy

### Deploy lên Netlify/Vercel

```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Vercel
npm install -g vercel
vercel --prod
```

---

**Version**: 1.0  
**Last Updated**: June 2024  
**Admin Frontend Documentation**
