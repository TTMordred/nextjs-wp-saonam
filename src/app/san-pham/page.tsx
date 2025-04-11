import { getPage } from '@/lib/api';
import { formatContent } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

async function getProductsPageData() {
  // Fetch products page content from WordPress
  const productsPage = await getPage('san-pham');
  return productsPage;
}

export default async function ProductsPage() {
  const productsPage = await getProductsPageData();

  // Sample product categories (in a real implementation, these would come from WordPress)
  const productCategories = [
    {
      id: 1,
      name: 'Máy tính, laptop',
      slug: 'may-tinh-laptop-linh-kien',
      image: '/placeholder.jpg',
    },
    {
      id: 2,
      name: 'Máy in, máy đa chức năng',
      slug: 'may-in-da-chuc-nang',
      image: '/placeholder.jpg',
    },
    {
      id: 3,
      name: 'Máy photocopy',
      slug: 'may-photocopy',
      image: '/placeholder.jpg',
    },
    {
      id: 4,
      name: 'Máy in siêu tốc',
      slug: 'may-photocopy-phu-kien',
      image: '/placeholder.jpg',
    },
    {
      id: 5,
      name: 'Máy chiếu',
      slug: 'may-chieu-phu-kien',
      image: '/placeholder.jpg',
    },
    {
      id: 6,
      name: 'Máy scan',
      slug: 'may-scan',
      image: '/placeholder.jpg',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Sản phẩm</h1>
      
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

      {/* Product Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {productCategories.map((category) => (
          <Link 
            key={category.id} 
            href={`/san-pham/${category.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="relative h-48 w-full">
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
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

      {/* Featured Brands */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Thương hiệu nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image 
                src="/placeholder-logo.png" 
                alt="Brand Logo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image 
                src="/placeholder-logo.png" 
                alt="Brand Logo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image 
                src="/placeholder-logo.png" 
                alt="Brand Logo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image 
                src="/placeholder-logo.png" 
                alt="Brand Logo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
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
