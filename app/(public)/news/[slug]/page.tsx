import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const article = await prisma.news.findUnique({
    where: { slug }
  });

  if (!article) {
    notFound();
  }

  const related = await prisma.news.findMany({
    where: {
      category: article.category,
      id: { not: article.id },
      published: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const getFormatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return '📋';
      case 'research': return '📖';
      case 'admissions': return '🎓';
      default: return '📢';
    }
  };

  return (
    <section className="py-20 px-6 bg-off-white flex-grow">
      <div className="container mx-auto max-w-4xl bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm my-8">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/news" className="text-xs font-semibold text-gray-500 hover:text-gold transition-colors inline-flex items-center gap-1">
            ← Back to News
          </Link>
          <span className="bg-gold-pale text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight">
            {article.title}
          </h1>
          <p className="text-xs text-gray-500 font-medium leading-none">
            Published on: <strong>{getFormatDate(article.createdAt)}</strong>
          </p>
        </div>

        {article.imageUrl && (
          <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden mb-8 border border-gray-200">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="border-t border-gray-150 pt-8 flex flex-col gap-6 text-left">
          <p className="text-base font-semibold text-gray-800 italic leading-relaxed">
            {article.excerpt}
          </p>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-gray-150 pt-12 mt-12 text-left">
            <h3 className="text-lg font-bold text-navy mb-6">Related News</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item: any) => (
                <Card key={item.id} className="p-0 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300">
                  <div className="h-32 bg-navy-light/10 flex items-center justify-center text-4xl select-none">
                    {getCategoryEmoji(item.category)}
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-gray-500 block mb-1">{getFormatDate(item.createdAt)}</span>
                    <Link href={`/news/${item.slug}`} className="text-xs font-bold text-navy hover:text-gold transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
