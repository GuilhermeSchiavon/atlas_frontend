'use client';

import { notFound } from 'next/navigation';
import PublicationCard from '@/components/PublicationCard';
import { useCategory, usePublications } from '@/hooks/useApi';

interface CategoriaPageProps {
  params: { slug: string };
}

export default function CategoriaPage({ params }: CategoriaPageProps) {
  const isNumeric = /^\d+$/.test(params.slug);
  const categoryId = isNumeric ? params.slug : null;
  
  const { category, isLoading: categoryLoading, error: categoryError } = useCategory(categoryId || params.slug);
  const { publications, isLoading: publicationsLoading, error: publicationsError } = usePublications({ 
    category_ids: category?.id ? [category.id] : undefined
  });

  if (categoryError || publicationsError) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar categoria</h1>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        </div>
      </div>
    );
  }

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="bg-primary text-white w-16 h-16 flex items-center justify-center font-bold text-2xl">
              {category.id}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text mb-4">
                {category.title}
              </h1>
              {category.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text">
              {publicationsLoading ? 'Carregando...' : `Publicações (${publications.length})`}
            </h2>
          </div>

          {publicationsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
          ) : publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma publicação encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Esta categoria ainda não possui publicações aprovadas.
              </p>
              <a href="/submit" className="btn-primary">
              Contribuir com Imagens
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}