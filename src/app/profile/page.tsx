'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser } from '@/utils/auth';
import { User } from '@/types';
import PublicationCard from '@/components/PublicationCard';
import { usePublications } from '@/hooks/useApi';
import ProfileSettings from '@/components/ProfileSettings';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('publications');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);

    if (searchParams.get('success')) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [router, searchParams]);

  // Buscar publicações do usuário
  const { publications, isLoading, error } = usePublications({profile: true});

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Erro ao carregar publicações: {error.message}</div>
      </div>
    );
  }

  // Filtrar publicações do usuário (mesmo para admin)
  const userPublications = publications.filter(p => p.user_id === user.id);
  const approvedPublications = userPublications.filter(p => p.status === 'approved');
  const pendingPublications = userPublications.filter(p => p.status === 'pending');
  const rejectedPublications = userPublications.filter(p => p.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Publicação enviada com sucesso! Aguarde a aprovação da equipe editorial.
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white shadow-sm mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary text-white rounded flex items-center justify-center text-2xl font-bold overflow-hidden">
                {user.image ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/${user.image}`} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent) {
                        parent.innerHTML = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
                      }
                    }}
                  />
                ) : (
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                    user.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status === 'ativo' ? 'Conta Ativa' : 'Pendente'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {user.accounType === 'adm' ? 'Administrador' : 'Médico Associado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userPublications.length}</div>
                <div className="text-sm text-gray-600">Total de Publicações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{approvedPublications.length}</div>
                <div className="text-sm text-gray-600">Aprovadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingPublications.length}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{rejectedPublications.length}</div>
                <div className="text-sm text-gray-600">Rejeitadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('publications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'publications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Minhas Publicações
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configurações
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'publications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-text">Suas Publicações</h2>
                  <a href="/submit" className="btn-primary">
                    Nova Publicação
                  </a>
                </div>

                {userPublications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPublications.map((publication) => (
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
                      Nenhuma publicação ainda
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comece contribuindo com o atlas enviando seu primeiro caso clínico.
                    </p>
                    <a href="/submit" className="btn-primary">
                      Enviar Primeira Publicação
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <ProfileSettings user={user} setUser={setUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}