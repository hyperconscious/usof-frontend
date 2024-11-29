import axios from '../api/axios';
import { PaginatedResponse, QueryOptions } from '../types/query';
import { Category } from '../types/category';

class CategoryService {
  static async getCategories(
    options: QueryOptions,
  ): Promise<PaginatedResponse<Category>> {
    const response = await axios.get('/api/categories', { params: options });
    return response.data;
  }

  static async createCategory(data: {
    title?: string;
    description?: string;
  }): Promise<Category> {
    const response = await axios.post('/api/categories', data);
    return response.data;
  }

  static async getCategoryById(categoryId: number): Promise<Category> {
    const response = await axios.get(`/api/categories/${categoryId}`);
    return response.data;
  }

  static async updateCategory(
    categoryId: number,
    data: { title?: string; description?: string },
  ): Promise<Category> {
    const response = await axios.patch(`/api/categories/${categoryId}`, data);
    return response.data;
  }

  static async deleteCategory(categoryId: number): Promise<Category> {
    const response = await axios.delete(`/api/categories/${categoryId}`);
    return response.data;
  }
}

export default CategoryService;
