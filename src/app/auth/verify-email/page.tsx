'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      // Mock verification - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification
      setStatus('success');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-text mb-4">Verificando email...</h2>
            <p className="text-gray-600">
              Aguarde enquanto confirmamos sua conta.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text mb-4">Email verificado com sucesso!</h2>
            <p className="text-gray-600 mb-6">
              Sua conta foi ativada. Você será redirecionado para a página de login em alguns segundos.
            </p>
            <Link href="/auth/login" className="btn-primary">
              Ir para Login
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text mb-4">Erro na verificação</h2>
            <p className="text-gray-600 mb-6">
              Não foi possível verificar seu email. O link pode estar inválido ou expirado.
            </p>
            <div className="space-y-4">
              <Link href="/auth/register" className="btn-primary block">
                Criar nova conta
              </Link>
              <Link href="/auth/login" className="text-primary hover:text-primary/80">
                Voltar ao login
              </Link>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text mb-4">Link expirado</h2>
            <p className="text-gray-600 mb-6">
              O link de verificação expirou. Solicite um novo email de confirmação.
            </p>
            <div className="space-y-4">
              <button className="btn-primary">
                Reenviar email
              </button>
              <Link href="/auth/login" className="text-primary hover:text-primary/80 block">
                Voltar ao login
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}