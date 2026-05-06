import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlas de Uro-dermatologia - Início',
  description: 'Atlas científico especializado em uro-dermatologia com publicações médicas de alta qualidade para profissionais da saúde.',
  openGraph: {
    title: 'Atlas de Uro-dermatologia',
    description: 'Atlas científico especializado em uro-dermatologia',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}