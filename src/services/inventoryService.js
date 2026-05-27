import api from './api';

export const inventoryService = {
  getInventory: async (params = {}) => {
    try {
      const response = await api.get('/admin/inventory', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateQuantity: async (id, quantity, note = '') => {
    try {
      const response = await api.put(`/admin/inventory/${id}`, { quantity, note });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
