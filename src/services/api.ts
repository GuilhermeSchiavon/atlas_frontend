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

  async verifyEmail(token: string): Promise<{ message: string; verified: boolean }> {
    return this.request<{ message: string; verified: boolean }>(`/api/v2/users/verify-email?token=${token}`);
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v2/users/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v2/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/v2/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Categories
  async getCategories(): Promise<{ itens: Category[] }> {
    try {
      return await this.request<{ itens: Category[] }>('/api/v2/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getCategory(idOrSlug: string): Promise<Category> {
    return this.request<Category>(`/api/v2/categories/${idOrSlug}`);
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

  async createCategory(title: string, description?: string): Promise<Category> {
    return this.request<Category>('/api/v2/categories', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  // Publications
  async getPublications(params?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: string;
    category_ids?: number[];
    profile?: boolean;
  }): Promise<{ itens: Publication[]; total: number; pages: number }> {
    if (params) {
      // Remove category_ids if empty array
      if (params.category_ids && params.category_ids.length === 0) {
        delete params.category_ids;
      }
    }
    
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    try {
      return await this.request<{ itens: Publication[]; total: number; pages: number }>(`/api/v2/publications${query}`);
    } catch (error) {
      console.error('Error fetching publications:', error);
      throw error;
    }
  }

  async getPublication(id: string): Promise<Publication> {
    return this.request<Publication>(`/api/v2/publications/${id}`);
  }

  async createPublication(formData: FormData): Promise<Publication> {
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

  // Legal Pages
  async getLegalPage(type: 'terms' | 'privacy'): Promise<{ id: number; type: string; title: string; content: string; updated_at: string }> {
    return this.request<{ id: number; type: string; title: string; content: string; updated_at: string }>(`/api/v2/legal/${type}`);
  }
}

export const api = new ApiService();