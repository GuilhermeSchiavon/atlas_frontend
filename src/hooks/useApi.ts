import useSWR from 'swr';
import { api } from '@/services/api';
import { Category, Publication } from '@/types';

export function useCategories() {
  const { data, error, isLoading } = useSWR('/categories', () => api.getCategories());
  
  return {
    categories: data?.categories || [],
    isLoading,
    error
  };
}

export function useFeaturedCategories(limit?: number) {
  const { data, error, isLoading } = useSWR(
    `/categories/featured${limit ? `?limit=${limit}` : ''}`,
    () => api.getFeaturedCategories(limit)
  );
  
  return {
    categories: data?.categories || [],
    isLoading,
    error
  };
}

export function useCategory(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/categories/${id}` : null,
    () => api.getCategory(id)
  );
  
  return {
    category: data?.category,
    isLoading,
    error
  };
}

export function usePublications(params?: {
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  category_ids?: number[];
}) {
  const { data, error, isLoading } = useSWR(
    ['/publications', params],
    () => api.getPublications(params)
  );
  
  return {
    publications: data?.publications || [],
    total: data?.total || 0,
    pages: data?.pages || 0,
    isLoading,
    error
  };
}

export function usePublication(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/publications/${id}` : null,
    () => api.getPublication(id)
  );
  
  return {
    publication: data?.publication,
    isLoading,
    error
  };
}