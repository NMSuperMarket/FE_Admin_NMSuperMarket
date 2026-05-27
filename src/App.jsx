import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Inventory from './pages/admin/Inventory';
import LoginPage from './pages/admin/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role?.name === 'admin';
  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role?.name === 'admin';
  if (token && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="categories" element={<div className="p-6 text-xl">Tính năng đang phát triển</div>} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
