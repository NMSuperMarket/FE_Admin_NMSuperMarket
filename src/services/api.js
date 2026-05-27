import axios from 'axios'
import useAuthStore from '@/store/authStore'

/**
 * Axios Instance — FE_Admin
 * Cấu hình HTTP client gọi đến Laravel API (BE_NMSuperMarket)
 *
 * Features:
 *  - baseURL trỏ đến BE Laravel port 8000
 *  - Request interceptor: tự động gắn JWT token vào header
 *  - Response interceptor: tự động logout khi nhận lỗi 401
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ───────────────────────────────────────────────────
// Tự động đính kèm JWT token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ──────────────────────────────────────────────────
// Xử lý lỗi toàn cục: 401 → tự động logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ → xoá auth và redirect login
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
