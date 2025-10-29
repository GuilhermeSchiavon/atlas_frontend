import Link from 'next/link';
import { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import ChapterGrid from '@/components/ChapterGrid';
import PublicationCard from '@/components/PublicationCard';

export const metadata: Metadata = {
  title: 'Atlas Dermatológico do Genital Masculino - Início',
  description: 'Atlas científico especializado em dermatologia do genital masculino com publicações médicas de alta qualidade para profissionais da saúde.',
  openGraph: {
    title: 'Atlas Dermatológico do Genital Masculino',
    description: 'Atlas científico especializado em dermatologia do genital masculino',
    type: 'website',
  },
};

// Mock data - replace with API calls
const mockChapters = [
  { id: 1, number: 1, title: "Exame físico do genital masculino", slug: "exame-fisico-do-genital-masculino", status: 'ativo' as const },
  { id: 2, number: 2, title: "Propedêutica dermatológica e urológica", slug: "propedeutica-dermatologica-e-urologica", status: 'ativo' as const },
  { id: 3, number: 3, title: "Biópsia cutânea do genital masculino", slug: "biopsia-cutanea-do-genital-masculino", status: 'ativo' as const },
];

const mockPublications = [
  {
    id: 1,
    title: "Caso de Pápulas Perláceas",
    diagnosis: "Pápulas perláceas do pênis",
    body_location: 'glande' as const,
    status: 'approved' as const,
    chapter_id: 6,
    user_id: 1,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    Chapter: { id: 6, number: 6, title: "Pápulas perláceas do pênis (Tyson)", slug: "papulas-perlaceas", status: 'ativo' as const },
    Images: [{ id: 1, publication_id: 1, filename: 'image1.jpg', path_local: '/uploads/image1.jpg', format: '.jpg', size: 1024, order: 1 }]
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Atlas Dermatológico do Genital Masculino
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Referência científica em dermatologia genital masculina para profissionais da saúde
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chapters" className="btn-secondary text-lg px-8 py-3">
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
            <Link href="/chapters" className="btn-primary text-lg px-8 py-3">
              Ver Todos os Capítulos
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Publications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Publicações Recentes
            </h2>
            <p className="text-gray-600">
              Últimas contribuições aprovadas pela comunidade médica
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/publications" className="btn-primary text-lg px-8 py-3">
              Ver Todas as Publicações
            </Link>
          </div>
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
                O Atlas Dermatológico do Genital Masculino é uma iniciativa científica 
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