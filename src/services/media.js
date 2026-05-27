import client from './api';

export const uploadImageToServer = async (file, path = 'images') => {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('image', file);
  formData.append('path', path);
  
  try {
    const response = await client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.url;
    } else {
      throw new Error(response.data.message || 'Lỗi tải ảnh lên');
    }
  } catch (error) {
    console.error('Error uploading image to Server:', error);
    throw error;
  }
};

const STORAGE_BASE_URL = 'http://127.0.0.1:8000/storage/'

export function resolveMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${STORAGE_BASE_URL}${cleanPath}`;
}
