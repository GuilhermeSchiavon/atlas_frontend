'use client';

import { useLegalPage } from '@/hooks/useApi';

export default function PrivacyPage() {
  const { page, isLoading, error } = useLegalPage('privacy');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-8 text-red-500">
            Erro ao carregar a política de privacidade
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white shadow-sm p-8">
          <h1 className="text-3xl font-bold text-text mb-8">
            {page?.title || 'Política de Privacidade'}
          </h1>
          
          <div 
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: page?.content || '' }}
          />
          
          {page?.updated_at && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(page.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}