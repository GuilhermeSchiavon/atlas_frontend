import Cookies from 'js-cookie';
import { AuthResponse, User, Category, Publication } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...(options.headers as Record<string, string> || {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v2/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cpf: string;
    crm: string;
    uf: string;
    especialidade: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v2/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/v2/users/profile');
  }

  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    try {
      return await this.request<{ categories: Category[] }>('/api/v2/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(idOrSlug: string): Promise<{ category: Category }> {
    return this.request<{ category: Category }>(`/api/v2/categories/${idOrSlug}`);
  }

  async getFeaturedCategories(limit?: number): Promise<{ categories: Category[] }> {
    const query = limit ? `?limit=${limit}` : '';
    try {
      return await this.request<{ categories: Category[] }>(`/api/v2/categories/featured${query}`);
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      throw error;
    }
  }

  // Publications
  async getPublications(params?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: string;
    category_ids?: number[];
  }): Promise<{ publications: Publication[]; total: number; pages: number }> {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    try {
      return await this.request<{ publications: Publication[]; total: number; pages: number }>(`/api/v2/publications${query}`);
    } catch (error) {
      console.error('Error fetching publications:', error);
      throw error;
    }
  }

  async getPublication(id: string): Promise<{ publication: Publication }> {
    return this.request<{ publication: Publication }>(`/api/v2/publications/${id}`);
  }

  async createPublication(formData: FormData): Promise<{ publication: Publication }> {
    const token = Cookies.get('token');
    const response = await fetch(`${API_BASE_URL}/api/v2/publications/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiService();