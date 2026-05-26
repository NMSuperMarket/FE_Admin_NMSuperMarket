import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Edit, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';
import { organizerApi } from '../api/organizer';
import DashboardLayout from '../components/layout/DashboardLayout';
import EventFormModal from '../components/events/EventFormModal';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch(status?.toLowerCase()) {
      case 'published':
        return { color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500', label: 'Đã xuất bản' };
      case 'draft':
        return { color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400', label: 'Bản nháp' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', label: 'Đã hủy' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400', label: status || 'Unknown' };
    }
  };
  
  const config = getStatusConfig();
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </div>
  );
};

const ProgressBar = ({ current, max }) => {
  const percentage = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#e96a52] rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-[50px]">{current}/{max}</span>
    </div>
  );
};

const MyEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await organizerApi.getAllEvents();
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (e, event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện bản nháp này?")) {
      try {
        await organizerApi.deleteEvent(id);
        fetchEvents();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa');
      }
    }
  };

  const handlePublish = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Sau khi Publish, sự kiện sẽ KHÔNG THỂ chỉnh sửa thông tin quan trọng. Bạn có chắc chắn?")) {
      try {
        await organizerApi.publishEvent(id);
        fetchEvents();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi');
      }
    }
  };

  const handleCancel = async (e, id) => {
    e.stopPropagation();
    const reason = window.prompt("Nhập lý do hủy sự kiện (sẽ gửi cho người đăng ký):");
    if (reason !== null) {
      try {
        await organizerApi.cancelEvent(id, reason);
        fetchEvents();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi');
      }
    }
  };

  const filteredEvents = events.filter(e => activeTab === 'all' || e.status === activeTab);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sự kiện</h1>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#e96a52] text-white px-4 py-2 rounded-lg hover:bg-[#d85840] transition-colors"
          >
            <Plus size={18} />
            <span>Tạo sự kiện mới</span>
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b pb-2">
          {['all', 'draft', 'published', 'cancelled'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize ${activeTab === tab ? 'bg-[#1F3846] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {tab === 'all' ? 'Tất cả' : tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
               <div className="flex justify-center items-center p-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e96a52]"></div>
               </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên sự kiện</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đăng ký</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr 
                      key={event.id} 
                      onClick={() => navigate(`/events/${event.id}`)} 
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer" 
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 hover:text-[#e96a52] transition-colors">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-64" onClick={(e) => e.stopPropagation()}>
                        <ProgressBar current={event.registrations_count || 0} max={event.capacity || 0} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {event.status === 'draft' && (
                            <>
                              <button onClick={(e) => handleEdit(e, event)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Sửa bản nháp">
                                <Edit size={16} />
                              </button>
                              <button onClick={(e) => handlePublish(e, event.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Xuất bản">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={(e) => handleDelete(e, event.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          {event.status === 'published' && (
                             <button onClick={(e) => handleCancel(e, event.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hủy sự kiện">
                               <XCircle size={16} />
                             </button>
                          )}
                          {event.status === 'cancelled' && (
                             <span className="text-gray-400 text-xs italic">Đã lưu trữ</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Không có sự kiện nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
      
      <EventFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEvents}
        initialData={selectedEvent}
      />
    </DashboardLayout>
  );
};

export default MyEventsPage;
