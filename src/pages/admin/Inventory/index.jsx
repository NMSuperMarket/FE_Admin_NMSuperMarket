import React, { useState, useEffect } from 'react';
import { Package, Search, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import { inventoryService } from '../../../services/inventoryService';
import { resolveMediaUrl } from '../../../services/media';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  
  // Update state tracking
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryService.getInventory({ 
        search, 
        low_stock: lowStockOnly,
        per_page: 50 
      });
      if (res.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory', error);
      alert('Không thể tải dữ liệu kho');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditQuantity(item.quantity || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuantity('');
  };

  const handleSave = async (id) => {
    if (editQuantity === '' || isNaN(editQuantity) || editQuantity < 0) {
      alert('Vui lòng nhập số lượng hợp lệ (>= 0)');
      return;
    }

    setUpdating(true);
    try {
      const res = await inventoryService.updateQuantity(id, parseInt(editQuantity), 'Admin cập nhật trực tiếp');
      if (res.success) {
        // Cập nhật local state
        setItems(items.map(item => item.id === id ? { ...item, quantity: res.data.quantity } : item));
        setEditingId(null);
      }
    } catch (error) {
      alert('Lỗi cập nhật số lượng');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text">Quản lý Kho</h1>
          <p className="text-text-muted mt-1">Theo dõi tồn kho và cảnh báo hết hàng</p>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded shadow-sm border">
            <input 
              type="checkbox" 
              checked={lowStockOnly} 
              onChange={(e) => setLowStockOnly(e.target.checked)} 
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text">Chỉ báo sắp hết hàng</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border">
        <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50 rounded-t-xl">
          <form onSubmit={handleSearch} className="relative w-96">
            <input
              type="text"
              placeholder="Tìm theo tên SP hoặc SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <button type="submit" className="hidden">Tìm</button>
          </form>
          <button 
            onClick={() => fetchInventory()} 
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border text-sm text-text-muted">
                <th className="p-4 font-medium">Sản phẩm</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium text-center">Đang giữ</th>
                <th className="p-4 font-medium text-center">Tồn kho hiện tại</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm nào.</td>
                </tr>
              ) : (
                items.map((item) => {
                  const qty = item.quantity || 0;
                  const alert = item.low_stock_alert || 10;
                  const isLow = qty <= alert;
                  
                  return (
                    <tr key={item.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={resolveMediaUrl(item.thumbnail)} alt="thumb" className="w-10 h-10 rounded border object-cover" />
                          <span className="font-medium text-text">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-text-muted">{item.sku}</td>
                      <td className="p-4 text-center">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          {item.reserved || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            min="0"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            className="w-20 text-center border border-primary rounded p-1 outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(item.id);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                        ) : (
                          <span className={`font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                            {qty}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {isLow ? (
                          <div className="flex items-center justify-center gap-1 text-red-500 text-sm font-medium">
                            <AlertTriangle size={16} /> Sắp hết
                          </div>
                        ) : (
                          <span className="text-green-500 text-sm font-medium">An toàn</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleSave(item.id)}
                              disabled={updating}
                              className="text-green-600 hover:bg-green-50 p-1.5 rounded transition"
                              title="Lưu"
                            >
                              <Save size={18} />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              className="text-gray-400 hover:bg-gray-100 p-1.5 rounded transition text-sm"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEdit(item)}
                            className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded text-sm font-medium transition"
                          >
                            Cập nhật
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
