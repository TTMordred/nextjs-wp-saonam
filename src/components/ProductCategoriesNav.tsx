'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductCategories } from '@/lib/api';

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export default function ProductCategoriesNav() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Default product categories as fallback (based on the screenshot)
  const defaultCategories = [
    { id: 1, name: 'Máy tính, laptop', slug: 'may-tinh-laptop' },
    { id: 2, name: 'Đầu in, mực chính hãng', slug: 'dau-in-muc-chinh-hang' },
    { id: 3, name: 'Tivi', slug: 'tivi' },
    { id: 4, name: 'Phụ kiện', slug: 'phu-kien' },
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

  if (loading) {
    return (
      <div className="bg-white py-1 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto whitespace-nowrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-1 border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-6 overflow-x-auto whitespace-nowrap text-xs">
          {categories.slice(0, 15).map((category) => (
            <Link
              key={category.id}
              href={category.slug ? `/san-pham/${category.slug}` : '/san-pham'}
              className="text-gray-700 hover:text-blue-600 transition duration-150"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
