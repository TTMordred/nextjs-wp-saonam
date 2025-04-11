import { Metadata } from 'next';
import { getCategories, getPosts, type Term } from '@/lib/api';
import { formatDate, extractExcerpt } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryParams {
  readonly params: {
    slug: string;
  };
  readonly searchParams: {
    page?: string;
  };
}

const POSTS_PER_PAGE = 9;

// Generate static paths for all categories
export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category: Term) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for the category page
export async function generateMetadata({ params }: CategoryParams): Promise<Metadata> {
  try {
    const categories = await getCategories();
    const category = categories.find((cat: Term) => cat.slug === params.slug);
    
    if (!category) {
      return {
        title: 'Danh mục không tồn tại | Sao Nam TG',
        description: 'Không tìm thấy danh mục này.',
      };
    }

    return {
      title: `${category.name} | Tin tức | Sao Nam TG`,
      description: category.description ?? `Xem tất cả bài viết trong danh mục ${category.name}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tin tức | Sao Nam TG',
      description: 'Đọc tin tức mới nhất từ Sao Nam TG',
    };
  }
}

async function getCategoryData(slug: string, page = 1) {
  try {
    const [categories, postsData] = await Promise.all([
      getCategories(),
      getPosts(page, POSTS_PER_PAGE, { category: slug }),
    ]);

    const category = categories.find((cat: Term) => cat.slug === slug);
    
    return {
      category,
      posts: postsData.posts ?? [],
      totalPages: postsData.totalPages ?? 1,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      category: null,
      posts: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
}

export default async function CategoryPage({ params, searchParams }: Readonly<CategoryParams>) {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { category, posts, totalPages } = await getCategoryData(params.slug, currentPage);
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Danh mục không tồn tại</h1>
          <p className="text-lg mb-8">Không tìm thấy danh mục bạn đang tìm kiếm.</p>
          <Link 
            href="/tin-tuc" 
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-200"
          >
            Quay lại trang Tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Category Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {post.featured_media && post._embedded?.['wp:featuredmedia']?.[0] && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post._embedded['wp:featuredmedia'][0].alt_text ?? post.title.rendered}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <time className="text-gray-500 text-sm mb-2 block">
                  {formatDate(post.date)}
                </time>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link href={`/tin-tuc/${post.slug}`} className="hover:text-blue-600 transition duration-200">
                    {post.title.rendered}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {extractExcerpt(post.excerpt.rendered)}
                </p>
                <Link
                  href={`/tin-tuc/${post.slug}`}
                  className="text-blue-600 font-medium hover:underline inline-flex items-center"
                >
                  Đọc thêm
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Chưa có bài viết nào trong danh mục này.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/tin-tuc/danh-muc/${params.slug}?page=${currentPage - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Trang trước
            </Link>
          )}
          <span className="px-4 py-2 text-blue-600 font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/tin-tuc/danh-muc/${params.slug}?page=${currentPage + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Trang sau
            </Link>
          )}
        </div>
      )}
    </div>
  );
}