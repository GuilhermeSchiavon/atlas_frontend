'use client';

import CategoryGrid from '@/components/CategoryGrid';
import SearchBar from '@/components/SearchBar';
import { useCategories } from '@/hooks/useApi';

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar temas</h1>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">
            Temas do Atlas
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Explore todas as temas do Atlas de Dermatologia do Genital Masculino
          </p>
          <SearchBar />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">
              {isLoading ? 'Carregando...' : `Todas as Temas (${categories.length})`}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </div>
    </div>
  );
}