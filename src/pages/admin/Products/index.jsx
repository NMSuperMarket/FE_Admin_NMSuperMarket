import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import client from '../../../services/api';
import { resolveMediaUrl } from '../../../services/media';
import ProductFormModal from './ProductFormModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await client.get('/admin/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await client.get('/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSaveProduct = async (payload, id) => {
    try {
      if (id) {
        await client.put(`/admin/products/${id}`, payload);
      } else {
        await client.post('/admin/products', payload);
      }
      fetchProducts();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await client.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Quản lý Sản phẩm</h1>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={20} />
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên sản phẩm, mã SKU..." 
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:border-primary shadow-sm"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-border text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Tồn kho</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const stock = product.inventory?.quantity || 0;
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock <= 10;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.thumbnail ? resolveMediaUrl(product.thumbnail) : `https://placehold.co/40x40?text=SP${product.id}`} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{product.category?.name}</td>
                      <td className="p-4">
                        <div className="text-sm">
                          {product.sale_price ? (
                            <>
                              <span className="font-bold text-red-600">{Number(product.sale_price).toLocaleString('vi-VN')}đ</span>
                              <span className="text-xs text-gray-400 line-through block">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                            </>
                          ) : (
                            <span className="font-bold text-primary">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium">{stock}</td>
                      <td className="p-4">
                        {isOutOfStock ? (
                          <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">Hết hàng</span>
                        ) : isLowStock ? (
                          <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold">Sắp hết</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">Đang bán</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
