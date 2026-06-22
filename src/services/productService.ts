import api from './api';
import type { Product } from '../types/types';

const normalizeProduct = (product: any): Product => ({
  _id: product._id || product.id || '',
  name: product.name || 'Untitled product',
  description: product.description || '',
  price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
  image: product.image || '',
  category: product.category || 'Other',
  stock: typeof product.stock === 'number' ? product.stock : Number(product.stock) || 0,
  seller: product.seller || { _id: '', name: 'Unknown' },
});

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products');
    return Array.isArray(response.data) ? response.data.map(normalizeProduct) : [];
  },
  async getById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return normalizeProduct(response.data);
  },
  async create(productData: FormData): Promise<Product> {
    const response = await api.post('/products', productData);
    return response.data;
  },
  async update(id: string, productData: FormData | Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};