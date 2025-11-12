'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PublicationCard from '@/components/PublicationCard';
import CategoryGrid from '@/components/CategoryGrid';
import { usePublications, useCategories } from '@/hooks/useApi';

const BODY_LOCATIONS = [
  { value: '', label: 'Todas as localizações' },
  { value: 'glande', label: 'Glande' },
  { value: 'escroto', label: 'Escroto' },
  { value: 'prepucio', label: 'Prepúcio' },
  { value: 'corpo_peniano', label: 'Corpo Peniano' },
  { value: 'regiao_inguinal', label: 'Região Inguinal' },
  { value: 'perianal', label: 'Perianal' },
  { value: 'outro', label: 'Outro' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigas' },
  { value: 'title', label: 'Título A-Z' },
  { value: 'category', label: 'Por categoria' },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchType, setSearchType] = useState<'publications' | 'categories'>('publications');
  const [filters, setFilters] = useState({
    keyword: initialQuery,
    category_ids: [] as string[],
    body_location: '',
    sort: 'newest',
    showFilters: false
  });

  const { publications, isLoading: pubLoading, error: pubError } = usePublications({
    keyword: filters.keyword,
    category_ids: filters.category_ids.length > 0 ? filters.category_ids.map(id => parseInt(id)) : []
  });

  const { categories, isLoading: catLoading, error: catError } = useCategories();

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
    category.description?.toLowerCase().includes(filters.keyword.toLowerCase())
  );

  const filteredPublications = publications
    .filter(pub => !filters.body_location || pub.body_location === filters.body_location)
    .sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return (a.Categories?.[0]?.id || 0) - (b.Categories?.[0]?.id || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search with current filters
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category_ids: [],
      body_location: '',
      sort: 'newest',
      showFilters: filters.showFilters
    });
  };

  const isLoading = searchType === 'publications' ? pubLoading : catLoading;
  const error = searchType === 'publications' ? pubError : catError;
  const results = searchType === 'publications' ? filteredPublications : filteredCategories;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-4">
            Pesquisar no Atlas
          </h1>
          <p className="text-gray-600">
            {initialQuery ? `Resultados para "${initialQuery}"` : 'Encontre temas e publicações'}
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                  placeholder="Buscar por título, diagnóstico, descrição..."
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-primary px-6 py-3"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                className="px-4 py-3 border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Filtros
              </button>
            </div>

            {/* Advanced Filters */}
            {filters.showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temas
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-gray-300 p-2">
                      {categories.map(category => (
                        <label key={category.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            value={category.id}
                            checked={filters.category_ids.includes(category.id.toString())}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFilters(prev => ({
                                ...prev,
                                category_ids: e.target.checked 
                                  ? [...prev.category_ids, value]
                                  : prev.category_ids.filter(id => id !== value)
                              }));
                            }}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{category.id}. {category.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização
                    </label>
                    <select
                      value={filters.body_location}
                      onChange={(e) => setFilters(prev => ({ ...prev, body_location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                    >
                      {BODY_LOCATIONS.map(location => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 focus:ring-primary focus:border-primary"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    Limpar filtros
                  </button>
                  <div className="text-sm text-gray-500">
                    {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Search Type Toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => setSearchType('publications')}
            className={`px-6 py-3 font-medium ${
              searchType === 'publications'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Publicações ({filteredPublications.length})
          </button>
          <button
            onClick={() => setSearchType('categories')}
            className={`px-6 py-3 font-medium ${
              searchType === 'categories'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Temas ({filteredCategories.length})
          </button>
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">Erro ao carregar resultados</div>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Tentar novamente
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros ou usar termos diferentes
              </p>
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div>
              {searchType === 'publications' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublications.map((publication) => (
                    <PublicationCard key={publication.id} publication={publication} />
                  ))}
                </div>
              ) : (
                <CategoryGrid categories={filteredCategories} />
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        {!filters.keyword && (
          <div className="mt-12 bg-gray-50 p-6">
            <h3 className="text-lg font-semibold text-text mb-4">Sugestões</h3>
            <div className="flex flex-wrap gap-2">
              {['pápulas perláceas', 'dermatite', 'psoríase', 'balanite', 'angioqueratoma'].map(term => (
                <button
                  key={term}
                  onClick={() => setFilters(prev => ({ ...prev, keyword: term }))}
                  className="px-3 py-1 bg-white border border-gray-300 hover:border-primary hover:text-primary text-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}