'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { WooProduct } from '@/lib/woocommerce';

interface ProductCardProps {
  readonly product: WooProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get the main product image or use a placeholder
  const productImage = product.images && product.images.length > 0
    ? product.images[0].src
    : '/images/placeholder-product.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      {/* Product image with sale badge if applicable */}
      <div className="relative">
        <Link href={`/san-pham/${product.slug}`}>
          <div className="relative h-48 w-full">
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          </div>
        </Link>

        {/* Featured badge if product is featured */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Nổi bật
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        <Link href={`/san-pham/${product.slug}`} className="block">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors text-gray-800">
            {product.name}
          </h3>
        </Link>

        {/* Product description */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 line-clamp-2">
            {product.short_description ? (
              <span dangerouslySetInnerHTML={{ __html: product.short_description.replace(/<[^>]*>/g, '') }} />
            ) : (
              'Xem chi tiết sản phẩm để biết thêm thông tin'
            )}
          </p>
        </div>

        {/* Contact button */}
        <Link
          href={`/san-pham/${product.slug}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors block text-center"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
