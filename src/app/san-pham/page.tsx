'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPage, Post } from '@/lib/api';
import { getProducts, getProductCategories, WooProduct, WooProductCategory } from '@/lib/woocommerce';
import { ensureAbsoluteImageUrl, shouldUnoptimizeImage } from '@/lib/imageUtils';
import ProductGrid from '@/components/products/ProductGrid';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [productsPage, setProductsPage] = useState<Post | null>(null);
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [categories, setCategories] = useState<WooProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Get current page from URL or default to 1
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // Get current category from URL
  const categorySlug = searchParams.get('category') ?? '';

  // Get search query from URL
  const searchQuery = searchParams.get('search') ?? '';

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        // Fetch page content
        const pageData = await getPage('san-pham');
        setProductsPage(pageData);

        // Fetch categories
        const { categories: fetchedCategories } = await getProductCategories();
        setCategories(fetchedCategories);

        // Find category ID from slug if category filter is applied
        let categoryId;
        if (categorySlug) {
          const category = fetchedCategories.find(cat => cat.slug === categorySlug);
          categoryId = category ? category.id : undefined;
        }

        // Fetch products with filters
        const { products: fetchedProducts, total, totalPages: pages } = await getProducts({
          page: currentPage,
          per_page: 12,
          category: categoryId,
          search: searchQuery || undefined,
        });

        setProducts(fetchedProducts);
        setTotalProducts(total);
        setTotalPages(pages);
      } catch (error) {
        console.error('Error fetching products data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, categorySlug, searchQuery]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/san-pham?${params.toString()}`);
  };

  // Sample product categories as fallback
  const fallbackCategories = [
    {
      id: 1,
      name: 'Máy tính, laptop',
      slug: 'may-tinh-laptop-linh-kien',
      image: '/images/products/may-tinh-laptop.jpg',
    },
    {
      id: 2,
      name: 'Máy in, máy đa chức năng',
      slug: 'may-in-da-chuc-nang',
      image: '/images/products/may-in.jpg',
    },
    {
      id: 3,
      name: 'Máy photocopy',
      slug: 'may-photocopy',
      image: '/images/products/may-photocopy.jpg',
    },
    {
      id: 4,
      name: 'Máy in siêu tốc',
      slug: 'may-photocopy-phu-kien',
      image: '/images/products/may-in-sieu-toc.jpg',
    },
    {
      id: 5,
      name: 'Máy chiếu',
      slug: 'may-chieu-phu-kien',
      image: '/images/products/may-chieu.jpg',
    },
    {
      id: 6,
      name: 'Máy scan',
      slug: 'may-scan',
      image: '/images/products/may-scan.jpg',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Sản phẩm</h1>

      {productsPage ? (
        <div>
          {/* If we have WordPress content, render it */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: productsPage.content.rendered }}
          />
        </div>
      ) : (
        // Fallback content if WordPress page is not available
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-center mb-8">
            Chúng tôi cung cấp đa dạng các sản phẩm chất lượng cao từ các thương hiệu uy tín trên thế giới. Tất cả sản phẩm đều được bảo hành chính hãng và có đội ngũ kỹ thuật hỗ trợ 24/7.
          </p>
        </div>
      )}

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm sản phẩm</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Nhập tên sản phẩm..."
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('search', e.currentTarget.value);
                    params.delete('page');
                    router.push(`/san-pham?${params.toString()}`);
                  }
                }}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  const input = document.getElementById('search') as HTMLInputElement;
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('search', input.value);
                  params.delete('page');
                  router.push(`/san-pham?${params.toString()}`);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="md:w-1/3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categorySlug}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) {
                  params.set('category', e.target.value);
                } else {
                  params.delete('category');
                }
                params.delete('page');
                router.push(`/san-pham?${params.toString()}`);
              }}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <ProductGrid
          products={products}
          totalProducts={totalProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      ) : (
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700">Không tìm thấy sản phẩm nào.</p>
              <button
                onClick={() => {
                  router.push('/san-pham');
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </>
      )}

      {/* Product Categories */}
      {products.length === 0 && !categorySlug && !searchQuery && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {(categories.length > 0 ? categories : fallbackCategories).map((category) => (
              <Link
                key={category.id}
                href={`/san-pham?category=${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={typeof category.image === 'object' && category.image?.src ? category.image.src : ensureAbsoluteImageUrl(category.image as string || '/images/placeholder-category.jpg')}
                      alt={category.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={shouldUnoptimizeImage(typeof category.image === 'object' && category.image?.src ? category.image.src : category.image as string)}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                    <p className="text-blue-600 font-medium">Xem sản phẩm →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn về sản phẩm?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và nhận báo giá chi tiết.</p>
        <Link
          href="/lien-he"
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200 inline-block"
        >
          Liên hệ ngay
        </Link>
      </div>
    </div>
  );
}
