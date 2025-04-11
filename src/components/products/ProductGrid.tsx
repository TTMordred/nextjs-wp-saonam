'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { WooProduct } from '@/lib/woocommerce';

interface ProductGridProps {
  readonly products: WooProduct[];
  readonly totalProducts: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange?: (page: number) => void;
  readonly loading?: boolean;
}

export default function ProductGrid({
  products,
  totalProducts,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState('default');

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseFloat(a.price || '0') - parseFloat(b.price || '0');
      case 'price-desc':
        return parseFloat(b.price || '0') - parseFloat(a.price || '0');
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
      default:
        return 0; // Default sorting (as returned from API)
    }
  });

  // Generate pagination links
  const paginationLinks = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationLinks.push(i);
  }

  return (
    <div>
      {/* Products count and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <p className="text-gray-600 mb-4 sm:mb-0">
          Hiển thị {products.length} / {totalProducts} sản phẩm
        </p>

        <div className="flex items-center">
          <label htmlFor="sort-by" className="mr-2 text-gray-600">
            Sắp xếp theo:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Product grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700">Không tìm thấy sản phẩm nào.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && onPageChange && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-1">
                {/* Previous page button */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  &laquo;
                </button>

                {/* Page numbers */}
                {paginationLinks.map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next page button */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
