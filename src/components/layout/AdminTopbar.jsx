import React, { useState } from 'react';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import client from '../../api/client';

export default function AdminTopbar() {
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await client.post('/logout');
    } catch (e) {
      console.error(e);
    }
    logout();
    window.location.href = '/login';
  };
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-text-muted hover:text-primary">
          <Menu size={24} />
        </button>
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="pl-10 pr-4 py-2 border border-border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white w-64 transition-all text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-text-muted hover:text-primary transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
            3
          </span>
        </button>
        
        <div className="relative border-l border-border pl-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-9 h-9 rounded-full shadow-sm group-hover:scale-105 transition-transform object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden md:block text-sm">
              <p className="font-semibold text-text">{user?.name || 'Admin'}</p>
              <p className="text-text-muted text-xs">Quản trị viên</p>
            </div>
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
