'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getProductCategories } from '@/lib/api';

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export default function ProductCategoriesSlider() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Default product categories as fallback (based on the screenshot)
  const defaultCategories = [
    { id: 1, name: 'Máy in', slug: 'may-in' },
    { id: 2, name: 'Đầu in, mực chính hãng', slug: 'dau-in-muc-chinh-hang' },
    { id: 3, name: 'Tivi', slug: 'tivi' },
    { id: 4, name: 'Phụ kiện khác', slug: 'phu-kien-khac' },
    { id: 5, name: 'Camera quan sát', slug: 'camera-quan-sat' },
    { id: 6, name: 'Đầu ghi Camera', slug: 'dau-ghi-camera' },
    { id: 7, name: 'Phát wifi', slug: 'phat-wifi' },
    { id: 8, name: 'Hub/Switch mạng', slug: 'hub-switch-mang' },
    { id: 9, name: 'USB Wifi', slug: 'usb-wifi' },
    { id: 10, name: 'Phụ kiện laptop', slug: 'phu-kien-laptop' },
    { id: 11, name: 'Máy tính', slug: 'may-tinh' },
    { id: 12, name: 'Trang chủ', slug: '' },
    { id: 13, name: 'Máy scan', slug: 'may-scan' },
    { id: 14, name: 'Máy chiếu', slug: 'may-chieu' },
    { id: 15, name: 'Máy photocopy', slug: 'may-photocopy' },
    { id: 16, name: 'Máy đa chức năng', slug: 'may-da-chuc-nang' },
    { id: 17, name: 'Tin Tức', slug: 'tin-tuc' },
    { id: 18, name: 'Liên hệ', slug: 'lien-he' },
    { id: 19, name: 'Dịch Vụ', slug: 'dich-vu' },
    { id: 20, name: 'Sản phẩm', slug: 'san-pham' },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Try to fetch product categories from WordPress
        const wpCategories = await getProductCategories();

        if (wpCategories && wpCategories.length > 0) {
          // Map WordPress categories to our format
          const formattedCategories = wpCategories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }));
          setCategories(formattedCategories);
        } else {
          // Use default categories if WordPress categories are not available
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Error fetching product categories:', error);
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { current: slider } = sliderRef;
      const scrollAmount = direction === 'left' ? -240 : 240;
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <>
        {/* Spacer to prevent content jump */}
        <div className="h-[116px]" />
        <div className="bg-gray-50 border-b border-gray-200 fixed top-[72px] left-0 right-0 z-40">
          <div className="container mx-auto relative">
            <div className="flex items-center justify-between overflow-x-auto whitespace-nowrap py-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-1" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (categories.length === 0) {
    return <div className="h-[72px]" />;
  }

  return (
    <>
      {/* Spacer to prevent content jump - accounts for both headers */}
      <div className="h-[116px]" />
      
      {/* Fixed sub-header below the main header */}
      <div className="bg-gray-50 border-b border-gray-200 fixed top-[72px] left-0 right-0 z-40">
        <div className="container mx-auto relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-1.5 rounded-full shadow-md z-10 hidden md:flex items-center justify-center border border-gray-200 text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Categories slider with better styling */}
          <div
            ref={sliderRef}
            className="flex items-center justify-between overflow-x-auto whitespace-nowrap text-xs scrollbar-hide py-3 px-4 md:px-8 gap-3 md:gap-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.slug ? `/san-pham/${category.slug}` : '/san-pham'}
                className="text-gray-700 hover:text-red-600 hover:underline transition duration-150 flex-shrink-0 text-[11px] md:text-xs font-medium border-r border-gray-200 pr-3 md:pr-4 last:border-0 uppercase"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-1.5 rounded-full shadow-md z-10 hidden md:flex items-center justify-center border border-gray-200 text-gray-600 hover:text-red-600 transition-colors"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
