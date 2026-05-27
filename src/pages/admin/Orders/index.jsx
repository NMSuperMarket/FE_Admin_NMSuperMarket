import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import client from '../../../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await client.get('/admin/orders');
      setOrders(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await client.put(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm kiếm mã đơn hàng, tên khách hàng..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Mã Đơn</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Thanh toán</th>
                  <th className="p-4">Tổng tiền</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{order.order_code}</div>
                      <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('vi-VN')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{order.shipping_name}</div>
                      <div className="text-sm text-gray-500">{order.shipping_phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium uppercase text-gray-600">{order.payment_method}</div>
                      <div className="text-xs text-gray-400">
                        {order.payment_status === 'paid' ? (
                          <span className="text-green-600 font-medium">Đã thanh toán</span>
                        ) : (
                          <span className="text-orange-500 font-medium">Chưa thanh toán</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-primary">
                      {Number(order.total_amount).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-primary mr-2"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đang giao hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
