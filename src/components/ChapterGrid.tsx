import Link from 'next/link';
import { Chapter } from '@/types';

interface ChapterGridProps {
  chapters: Chapter[];
}

export default function ChapterGrid({ chapters }: ChapterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/capitulo/${chapter.slug}`}
          className="card p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-primary text-white w-12 h-12 flex items-center justify-center font-bold text-lg">
              {chapter.number}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-text mb-2 line-clamp-2">
                {chapter.title}
              </h3>
              {chapter.description && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {chapter.description}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}