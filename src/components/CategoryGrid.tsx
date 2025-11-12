import Link from 'next/link';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categoria/${category.slug}`}
          className="card p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className={`text-white w-12 h-12 flex items-center justify-center font-bold text-lg ${
                (category.publicationCount || 0) > 0 
                  ? 'bg-primary' 
                  : 'bg-gray-200'
                }`}>
              {category.id}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-text mb-2 line-clamp-2">
                {category.title}
              </h3>
              {category.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                  {category.description}
                </p>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  (category.publicationCount || 0) > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.publicationCount || 0} publicações
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}