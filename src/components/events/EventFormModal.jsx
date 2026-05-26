import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { organizerApi } from '../../api/organizer';

const EventFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    location: '',
    capacity: '',
    category_id: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        start_time: initialData.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
        end_time: initialData.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : '',
        registration_deadline: initialData.registration_deadline ? new Date(initialData.registration_deadline).toISOString().slice(0, 16) : '',
        location: initialData.location || '',
        capacity: initialData.capacity || '',
        category_id: initialData.category_id || 1,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        registration_deadline: '',
        location: '',
        capacity: '',
        category_id: 1,
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (initialData) {
        await organizerApi.updateEvent(initialData.id, formData);
      } else {
        await organizerApi.createEvent(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" rows="3"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
              <input required type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
              <input required type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hạn đăng ký</label>
              <input required type="datetime-local" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
              <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục (ID)</label>
            <input required type="number" name="category_id" value={formData.category_id} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#e96a52] text-white rounded-lg hover:bg-[#d85840] disabled:opacity-50">
              {loading ? 'Đang xử lý...' : 'Lưu sự kiện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
