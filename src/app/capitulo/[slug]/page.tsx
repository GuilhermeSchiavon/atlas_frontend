'use client';

import { redirect } from 'next/navigation';

interface CapituloPageProps {
  params: { slug: string };
}

export default function CapituloPage({ params }: CapituloPageProps) {
  // Redirect to new category route
  redirect(`/categoria/${params.slug}`);
}