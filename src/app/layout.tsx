import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Atlas de Dermatologia do Genital Masculino - Início',
  description: 'Atlas científico especializado em dermatologia do genital masculino com publicações médicas de alta qualidade para profissionais da saúde.',
  openGraph: {
    title: 'Atlas de Dermatologia do Genital Masculino',
    description: 'Atlas científico especializado em dermatologia do genital masculino',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}