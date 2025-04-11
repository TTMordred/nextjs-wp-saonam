'use client';

import Link from 'next/link';
import { WooProduct } from '@/lib/woocommerce';

interface ContactButtonProps {
  readonly product: WooProduct;
}

export default function ContactButton({ product }: ContactButtonProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          Để biết thêm thông tin chi tiết và báo giá về sản phẩm này, vui lòng liên hệ với chúng tôi.
        </p>
      </div>

      <Link
        href="/lien-he"
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-center transition-colors flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Liên hệ để biết giá
      </Link>

      {product.sku && (
        <div className="mt-4">
          <span className="text-sm text-gray-700">Mã sản phẩm: <span className="font-medium">{product.sku}</span></span>
        </div>
      )}
    </div>
  );
}
