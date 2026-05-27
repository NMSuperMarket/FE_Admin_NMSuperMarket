import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Archive, Users, FileText } from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Danh mục', path: '/admin/categories', icon: <Tag size={20} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Tồn kho', path: '/admin/inventory', icon: <Archive size={20} /> },
    { name: 'Khách hàng', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Hóa đơn', path: '/admin/invoices', icon: <FileText size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#1e3a5f] text-white hidden md:flex flex-col h-full shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary-light">🛒</span>
          NMS Admin
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-white font-medium shadow-md' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300">
          NMSuperMarket Admin v1.0
        </div>
      </div>
    </aside>
  );
}
