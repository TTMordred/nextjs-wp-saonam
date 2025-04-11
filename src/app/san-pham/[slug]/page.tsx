import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/products/ProductCard';
import ContactButton from '@/components/products/ContactButton';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
      description: 'Không tìm thấy sản phẩm bạn đang tìm kiếm.',
    };
  }

  return {
    title: `${product.name} | Sao Nam TG`,
    description: product.short_description.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_description.replace(/<[^>]*>/g, '').slice(0, 160),
      images: product.images && product.images.length > 0 ? [product.images[0].src] : [],
    },
  };
}

// Fetch product data
async function getProductData(slug: string) {
  const product = await getProductBySlug(slug);

  if (!product) {
    return { product: null, relatedProducts: [] };
  }

  const relatedProducts = await getRelatedProducts(product.id, 4);

  return { product, relatedProducts };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product, relatedProducts } = await getProductData(params.slug);

  if (!product) {
    notFound();
  }

  // Get the main product image or use a placeholder
  const mainImage = product.images && product.images.length > 0
    ? product.images[0].src
    : '/images/placeholder-product.jpg';

  // Get additional product images
  const additionalImages = product.images && product.images.length > 1
    ? product.images.slice(1)
    : [];

  // We're not displaying prices in the product showcase approach

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/san-pham" className="text-gray-600 hover:text-blue-600">
                  Sản phẩm
                </Link>
              </div>
            </li>
            {product.categories && product.categories.length > 0 && (
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link
                    href={`/san-pham/danh-muc/${product.categories[0].slug}`}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    {product.categories[0].name}
                  </Link>
                </div>
              </li>
            )}
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div>
            {/* Main image */}
            <div className="relative h-96 w-full mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />

              {/* Featured badge */}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded">
                  Nổi bật
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {additionalImages.map((image, i) => (
                  <div
                    key={`image-${image.id || i}`}
                    className="relative h-24 border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500"
                  >
                    <Image
                      src={image.src}
                      alt={`${product.name} - Hình ${i + 2}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* SKU */}
            {product.sku && (
              <p className="text-gray-500 mb-4">
                Mã sản phẩm: <span className="font-medium">{product.sku}</span>
              </p>
            )}

            {/* Product status */}
            <div className="mb-6">
              <div className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.stock_status === 'instock' ? 'Còn hàng' : 'Liên hệ để đặt hàng'}
              </div>
            </div>

            {/* Short description */}
            {product.short_description && (
              <div
                className="prose prose-sm mb-6"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Contact button */}
            <div className="mb-8">
              <ContactButton product={product} />
            </div>

            {/* Categories and tags */}
            <div className="border-t border-gray-200 pt-4">
              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 mr-2">Danh mục:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/san-pham/danh-muc/${category.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Thẻ:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/san-pham/tag/${tag.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product description */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Mô tả sản phẩm</h2>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
