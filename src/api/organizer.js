
import client from './client';

export const organizerApi = {
  // Lấy các chỉ số thống kê tổng quan cho Dashboard
  getDashboardStats: async () => {
    const response = await client.get('/organizer/dashboard/stats');
    return response.data;
  },

  // Lấy danh sách 5 sự kiện gần nhất cho Dashboard
  getRecentEvents: async () => {
    const response = await client.get('/organizer/dashboard/events');
    return response.data;
  },

  // Lấy tất cả sự kiện của Organizer
  getAllEvents: async () => {
    const response = await client.get('/organizer/events');
    return response.data;
  },

  // Lấy dữ liệu chi tiết sự kiện 
  getEventDetail: async (id) => {
    const response = await client.get(`/organizer/events/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await client.post('/organizer/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await client.put(`/organizer/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await client.delete(`/organizer/events/${id}`);
    return response.data;
  },

  publishEvent: async (id) => {
    const response = await client.post(`/organizer/events/${id}/publish`);
    return response.data;
  },

  cancelEvent: async (id, reason) => {
    const response = await client.post(`/organizer/events/${id}/cancel`, { cancel_reason: reason });
    return response.data;
  }
};