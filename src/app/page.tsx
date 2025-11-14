'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import PublicationCard from '@/components/PublicationCard';
import { usePublications } from '@/hooks/useApi';
import { getUser } from '@/utils/auth';
import { User } from '@/types';
import { useFeaturedCategories } from '@/hooks/useApi';


export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const { publications, isLoading, error } = usePublications({ status: 'approved' });
  const { categories, isLoading: isLoadingCategories, error: errorCategories } = useFeaturedCategories(6);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Atlas de Dermatologia do 
              <span className='text-secondary whitespace-nowrap'> Genital Masculino</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Referência científica em dermatologia genital masculina para profissionais da saúde
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categorias" className="btn-secondary text-lg px-8 py-3">
                Explorar Temas
              </Link>
              <Link href={user ? "/submit" : "/auth/register"} className="border border-white text-white px-8 py-3 hover:bg-white hover:text-primary transition-colors">
              Contribuir com Imagens
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text mb-4">
              Buscar por Capítulos
            </h2>
            <p className="text-gray-600">
              Encontre rapidamente o conteúdo que você precisa
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Temas em Destaque
            </h2>
            <p className="text-gray-600">
              Explore os principais tópicos do atlas
            </p>
          </div>
          {isLoadingCategories ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : errorCategories ? (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar os temas
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
          <div className="text-center mt-8">
            <Link href="/categorias" className="btn-primary text-lg px-8 py-3">
              Ver Todos os Temas
            </Link>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Casos Clínicos Recentes</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar publicações: {error.message}
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma publicação encontrada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {publications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text mb-6">
                Sobre o Atlas
              </h2>
              <p className="text-gray-600 mb-4">
                O Atlas de Dermatologia do Genital Masculino é uma iniciativa científica 
                que reúne casos clínicos e conhecimento especializado em dermatologia 
                genital masculina.
              </p>
              <p className="text-gray-600 mb-6">
                Desenvolvido por e para profissionais da saúde, oferece uma referência 
                visual e científica de alta qualidade para diagnóstico e tratamento.
              </p>
              <Link href="/about" className="btn-primary">
                Saiba Mais
              </Link>
            </div>
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <span className="text-gray-500">Imagem do Atlas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curators Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Curadores
            </h2>
            <p className="text-gray-600">
              Médicos especialistas responsáveis pela curadoria científica do atlas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Dr. Marcelo Wroclawski</h3>
              <p className="text-gray-600">Médico Especialista</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Dr. José Amorim</h3>
              <p className="text-gray-600">Médico Especialista</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 w-48 h-48 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Dr. Júlio Geminiani</h3>
              <p className="text-gray-600">Médico Especialista</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}