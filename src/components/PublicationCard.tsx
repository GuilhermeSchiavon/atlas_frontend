import Link from 'next/link';
import Image from 'next/image';
import { Publication } from '@/types';

interface PublicationCardProps {
  publication: Publication;
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  const firstImage = publication.Images?.[0];

  return (
    <Link href={`/publication/${publication.id}`} className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        {firstImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${firstImage.path_local}`}
            alt={publication.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-wrap gap-1">
            {publication.Categories?.slice(0, 2).map((category) => (
              <Link 
                key={category.id}
                href={`/categoria/${category.slug || category.id}`} 
                className="text-xs bg-primary/70 text-white px-2 py-1 hover:bg-primary/90"
              >
                {category.title}
              </Link>
            ))}
            {publication.Categories && publication.Categories.length > 2 && (
              <span className="text-xs bg-gray-500 text-white px-2 py-1">
                +{publication.Categories.length - 2}
              </span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 ${
            publication.status === 'approved' ? 'bg-green-100 text-green-800' :
            publication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {publication.status === 'approved' ? 'Aprovado' :
             publication.status === 'pending' ? 'Pendente' : 'Rejeitado'}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {publication.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          <strong>Diagnóstico:</strong> {publication.diagnosis}
        </p>
        
        <p className="text-sm text-gray-600 mb-3">
          <strong>Localização:</strong> {publication.body_location}
        </p>
        
        <div className="text-xs text-gray-500">
          {new Date(publication.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </Link>
  );
}