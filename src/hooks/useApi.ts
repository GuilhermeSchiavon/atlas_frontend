import useSWR from 'swr';
import { api } from '@/services/api';
import { Chapter, Publication } from '@/types';

export function useChapters() {
  const { data, error, isLoading } = useSWR('/chapters', () => api.getChapters());
  
  return {
    chapters: data?.chapters || [],
    isLoading,
    error
  };
}

export function useChapter(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/chapters/${id}` : null,
    () => api.getChapter(id)
  );
  
  return {
    chapter: data?.chapter,
    isLoading,
    error
  };
}

export function usePublications(params?: {
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  chapter_id?: number;
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