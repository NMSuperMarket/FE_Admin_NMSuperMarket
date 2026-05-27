import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImageToServer } from '../../../services/media';

export default function ProductFormModal({ isOpen, onClose, product, categories, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    sale_price: '',
    stock: '',
    unit: 'cái',
    is_featured: false,
    thumbnail: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        price: product.price || '',
        sale_price: product.sale_price || '',
        stock: product.inventory?.quantity || 0,
        unit: product.unit || 'cái',
        is_featured: product.is_featured || false,
        thumbnail: product.thumbnail || '',
      });
      setImagePreview(product.thumbnail);
    } else {
      setFormData({
        name: '', category_id: categories[0]?.id || '', price: '', sale_price: '', stock: '', unit: 'cái', is_featured: false, thumbnail: ''
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalThumbnail = formData.thumbnail;
      
      // Upload image to Firebase if a new file is selected
      if (imageFile) {
        finalThumbnail = await uploadImageToServer(imageFile, 'products');
      }

      // Prepare payload
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now(),
        sku: 'SKU-' + Date.now(),
        thumbnail: finalThumbnail
      };

      await onSave(payload, product?.id);
      onClose();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      alert("Đã xảy ra lỗi khi lưu sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Tải ảnh lên</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={24} className="text-white" />
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Danh mục *</label>
                <select 
                  required
                  value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Chọn danh mục...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giá bán (VNĐ) *</label>
                <input 
                  type="number" required min="0"
                  value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Giá khuyến mãi (VNĐ)</label>
                <input 
                  type="number" min="0"
                  value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tồn kho *</label>
                <input 
                  type="number" required min="0"
                  value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Đơn vị tính</label>
                <input 
                  type="text" 
                  value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" id="is_featured"
                checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Sản phẩm Nổi Bật (Sẽ hiển thị ngoài trang chủ)</label>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            form="product-form"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}
