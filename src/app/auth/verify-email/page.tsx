'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'no-token'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('no-token');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const { api } = await import('@/services/api');
      const response = await api.verifyEmail(token);
      
      setMessage(response.message);
      setStatus('success');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      setMessage(error.message || 'Erro na verificação');
      if (error.message?.includes('expirado')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      alert('Por favor, digite seu email');
      return;
    }

    setIsResending(true);
    try {
      const { api } = await import('@/services/api');
      const response = await api.resendVerification(email);
      alert(response.message);
    } catch (error: any) {
      alert(error.message || 'Erro ao reenviar email');
    } finally {
      setIsResending(false);
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
            <div className="flex flex-col space-y-4">
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
            <p className="text-gray-600 mb-4">
              {message || 'O link de verificação expirou. Solicite um novo email de confirmação.'}
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button 
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="btn-primary whitespace-nowrap"
                >
                  {isResending ? 'Enviando...' : 'Reenviar'}
                </button>
              </div>
              <Link href="/auth/login" className="text-primary hover:text-primary/80 block">
                Voltar ao login
              </Link>
            </div>
          </div>
        );

      case 'no-token':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text mb-4">Verificação de Email</h2>
            <p className="text-gray-600 mb-6">
              Para verificar seu email, clique no link enviado para sua caixa de entrada.
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Digite seu email para reenviar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button 
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="btn-primary whitespace-nowrap"
                >
                  {isResending ? 'Enviando...' : 'Reenviar Email'}
                </button>
              </div>
              <Link href="/auth/login" className="text-primary hover:text-primary/80">
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