import Cookies from 'js-cookie';
import { AuthResponse, User, Chapter, Publication } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

class ApiService {
  private getAuthHeaders() {
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api/v2/${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
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
    return this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    crm?: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/users/profile');
  }

  // Chapters
  async getChapters(): Promise<{ chapters: Chapter[] }> {
    try {
      return await this.request<{ chapters: Chapter[] }>('/chapters');
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  }

  async getChapter(idOrSlug: string): Promise<{ chapter: Chapter }> {
    return this.request<{ chapter: Chapter }>(`/chapters/${idOrSlug}`);
  }

  // Publications
  async getPublications(params?: {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: string;
    chapter_id?: number;
  }): Promise<{ publications: Publication[]; total: number; pages: number }> {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    try {
      return await this.request<{ publications: Publication[]; total: number; pages: number }>(`/publications${query}`);
    } catch (error) {
      console.error('Error fetching publications:', error);
      throw error;
    }
  }

  async getPublication(id: string): Promise<{ publication: Publication }> {
    return this.request<{ publication: Publication }>(`/publications/${id}`);
  }

  async createPublication(formData: FormData): Promise<{ publication: Publication }> {
    const token = Cookies.get('token');
    const response = await fetch(`${API_BASE_URL}/publications/upload`, {
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