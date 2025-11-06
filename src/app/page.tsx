'use client';

import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ChapterGrid from '@/components/ChapterGrid';
import PublicationCard from '@/components/PublicationCard';
import { usePublications } from '@/hooks/useApi';

// Mock data - replace with API calls
const mockChapters = [
  { id: 1, number: 1, title: "Exame físico do genital masculino", slug: "exame-fisico-do-genital-masculino", status: 'ativo' as const },
  { id: 2, number: 2, title: "Propedêutica dermatológica e urológica", slug: "propedeutica-dermatologica-e-urologica", status: 'ativo' as const },
  { id: 3, number: 3, title: "Biópsia cutânea do genital masculino", slug: "biopsia-cutanea-do-genital-masculino", status: 'ativo' as const },
];



export default function HomePage() {
  const { publications, isLoading, error } = usePublications({ status: 'approved' });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Atlas de Dermatológia do 
              <span className='text-secondary'> Genital Masculino</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Referência científica em dermatologia genital masculina para profissionais da saúde
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/capitulos" className="btn-secondary text-lg px-8 py-3">
                Explorar Capítulos
              </Link>
              <Link href="/auth/register" className="border border-white text-white px-8 py-3 hover:bg-white hover:text-primary transition-colors">
                Contribuir
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

      {/* Featured Chapters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Capítulos em Destaque
            </h2>
            <p className="text-gray-600">
              Explore os principais tópicos do atlas
            </p>
          </div>
          <ChapterGrid chapters={mockChapters} />
          <div className="text-center mt-8">
            <Link href="/capitulos" className="btn-primary text-lg px-8 py-3">
              Ver Todos os Capítulos
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
    </div>
  );
}