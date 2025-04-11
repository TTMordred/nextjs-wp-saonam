import { Metadata } from 'next';
import { getPosts, getCategories, type Term } from '@/lib/api';
import { formatDate, extractExcerpt } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPageProps {
  readonly searchParams: {
    page?: string;
    category?: string;
    search?: string;
  };
}

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Tin tức | Sao Nam TG',
  description: 'Cập nhật tin tức mới nhất từ Sao Nam TG về thiết bị văn phòng, công nghệ và các giải pháp kinh doanh.',
};

async function getBlogData(page = 1, category?: string, search?: string) {
  try {
    const [postsData, categories] = await Promise.all([
      getPosts(page, POSTS_PER_PAGE, { category, search }),
      getCategories(),
    ]);
    
    return {
      posts: postsData.posts ?? [],
      totalPages: postsData.totalPages ?? 1,
      currentPage: page,
      categories: categories ?? [],
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      posts: [],
      totalPages: 1,
      currentPage: 1,
      categories: [],
    };
  }
}

export default async function BlogPage({ searchParams }: Readonly<BlogPageProps>) {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { posts, totalPages, categories } = await getBlogData(
    currentPage,
    searchParams.category,
    searchParams.search
  );

  function getPageUrl(page: number): string {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.search) params.set('search', searchParams.search);
    return `/tin-tuc${params.toString() ? `?${params}` : ''}`;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tin tức mới nhất</h1>
        <p className="text-lg text-gray-600">
          Cập nhật tin tức mới nhất về công nghệ và giải pháp kinh doanh
        </p>
      </div>

      {/* Categories */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/tin-tuc"
          className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
            !searchParams.category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((category: Term) => (
          <Link
            key={category.id}
            href={`/tin-tuc?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
              searchParams.category === category.slug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
            {category.count ? ` (${category.count})` : ''}
          </Link>
        ))}
      </div>

      {/* Search Form */}
      <form action="/tin-tuc" method="get" className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="Tìm kiếm bài viết..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

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
          <p className="text-lg text-gray-600 mb-4">
            {searchParams.search
              ? `Không tìm thấy bài viết nào với từ khóa "${searchParams.search}"`
              : 'Chưa có bài viết nào trong danh mục này.'}
          </p>
          <Link
            href="/tin-tuc"
            className="text-blue-600 font-medium hover:underline"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={getPageUrl(currentPage - 1)}
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
              href={getPageUrl(currentPage + 1)}
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
