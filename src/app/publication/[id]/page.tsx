'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { usePublication } from '@/hooks/useApi';

interface PublicationPageProps {
  params: { id: string };
}

export default function PublicationPage({ params }: PublicationPageProps) {
  const { publication, isLoading, error } = usePublication(params.id);

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar publicação</h1>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!publication) {
    notFound();
  }

  const bodyLocationLabels = {
    glande: 'Glande',
    escroto: 'Escroto',
    prepucio: 'Prepúcio',
    corpo_peniano: 'Corpo Peniano',
    regiao_inguinal: 'Região Inguinal',
    perianal: 'Perianal',
    outro: 'Outro'
  };

  const skinColorLabels = {
    clara: 'Clara',
    morena: 'Morena',
    negra: 'Negra',
    amarela: 'Amarela',
    indigena: 'Indígena'
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-primary">Início</Link></li>
            <li>/</li>
            <li><Link href={`/capitulo/${publication.Chapter?.slug || publication.Chapter?.id}`} className="hover:text-primary">
              Cap. {publication.Chapter?.number}
            </Link></li>
            <li>/</li>
            <li className="text-gray-900">{publication.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm p-6">
              <h1 className="text-3xl font-bold text-text mb-6">
                {publication.title}
              </h1>
              
              {publication.Images && publication.Images.length > 0 && (
                <div className="space-y-4">
                  {publication.Images.map((image, index) => (
                    <div key={image.id} className="relative">
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <Image
                          src={`/api/images/${image.id}`}
                          alt={`${publication.title} - Imagem ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Imagem {index + 1} de {publication.Images.length}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Publication Details */}
          <div className="space-y-6">
            {/* Chapter Info */}
            <div className="bg-white shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Capítulo</h3>
              <Link 
                href={`/capitulo/${publication.Chapter?.slug || publication.Chapter?.id}`}
                className="flex items-center space-x-3 p-3 border hover:bg-gray-50 transition-colors"
              >
                <div className="bg-primary text-white w-10 h-10 flex items-center justify-center font-bold">
                  {publication.Chapter?.number}
                </div>
                <div>
                  <p className="font-medium">{publication.Chapter?.title}</p>
                </div>
              </Link>
            </div>

            {/* Clinical Data */}
            <div className="bg-white shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Dados Clínicos</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Diagnóstico</dt>
                  <dd className="text-sm text-gray-900">{publication.diagnosis}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Localização</dt>
                  <dd className="text-sm text-gray-900">
                    {bodyLocationLabels[publication.body_location]}
                  </dd>
                </div>
                {publication.patient_age && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Idade do Paciente</dt>
                    <dd className="text-sm text-gray-900">{publication.patient_age} anos</dd>
                  </div>
                )}
                {publication.patient_skin_color && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cor da Pele</dt>
                    <dd className="text-sm text-gray-900">
                      {skinColorLabels[publication.patient_skin_color]}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Publication Info */}
            <div className="bg-white shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4">Informações da Publicação</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Autor</dt>
                  <dd className="text-sm text-gray-900">
                    {publication.Author?.firstName} {publication.Author?.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Data de Publicação</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(publication.createdAt).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Aprovado
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Description */}
        {publication.description && (
          <div className="mt-8 bg-white shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Descrição do Caso</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {publication.description}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link 
            href={`/capitulo/${publication.Chapter?.slug || publication.Chapter?.id}`}
            className="flex items-center text-primary hover:text-primary/80"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao capítulo
          </Link>
          
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-primary">
              Publicação anterior
            </button>
            <button className="text-gray-600 hover:text-primary">
              Próxima publicação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}