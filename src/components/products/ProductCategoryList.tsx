'use client';

import Link from 'next/link';
import { WooProductCategory } from '@/lib/woocommerce';

interface ProductCategoryListProps {
  categories: WooProductCategory[];
  currentCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

export default function ProductCategoryList({
  categories,
  currentCategory = '',
  onCategoryChange,
}: ProductCategoryListProps) {
  // Handle category click
  const handleCategoryClick = (slug: string, e: React.MouseEvent) => {
    if (onCategoryChange) {
      e.preventDefault();
      onCategoryChange(slug);
    }
  };

  return (
    <div className="space-y-2">
      <div 
        className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${
          currentCategory === '' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
        }`}
        onClick={(e) => handleCategoryClick('', e)}
      >
        <Link href="/san-pham" className="w-full">
          Tất cả sản phẩm
        </Link>
      </div>
      
      {categories.map((category) => (
        <div
          key={category.id}
          className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${
            currentCategory === category.slug ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={(e) => handleCategoryClick(category.slug, e)}
        >
          <Link href={`/san-pham?category=${category.slug}`} className="w-full">
            {category.name}
            {category.count > 0 && (
              <span className="ml-2 text-sm text-gray-500">({category.count})</span>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
