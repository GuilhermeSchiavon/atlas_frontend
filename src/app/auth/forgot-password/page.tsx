'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { api } = await import('@/services/api');
      const response = await api.forgotPassword(email);
      setMessage(response.message);
      setSuccess(true);
    } catch (error: any) {
      setMessage(error.message || 'Erro ao enviar email de recuperação');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-text">
          Esqueci minha senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite seu email para receber instruções de recuperação
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:px-10">
          {!success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3">
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Digite seu email"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isLoading ? 'Enviando...' : 'Enviar instruções'}
                </button>
              </div>

              <div className="text-center">
                <Link href="/auth/login" className="text-primary hover:text-primary/80">
                  Voltar ao login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text mb-2">Email enviado!</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link href="/auth/login" className="btn-primary">
                Voltar ao login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}