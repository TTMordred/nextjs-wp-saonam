import { getPosts, getCategories } from '@/lib/api';
import { formatDate, extractExcerpt } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

async function getBlogPageData() {
  // Fetch posts with pagination
  const { posts, totalPages } = await getPosts(1, 9);
  
  // Fetch categories
  const categories = await getCategories();
  
  return {
    posts: posts || [],
    totalPages,
    categories: categories || [],
  };
}

export default async function BlogPage() {
  const { posts, totalPages, categories } = await getBlogPageData();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Tin tức</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-3/4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  {post.featured_media ? (
                    <div className="relative h-48 w-full">
                      <Image 
                        src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'}
                        alt={post.title.rendered}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <p className="text-gray-500 text-sm mb-2">{formatDate(post.date)}</p>
                    <h3 className="text-xl font-bold mb-2">{post.title.rendered}</h3>
                    <p className="text-gray-600 mb-4">{extractExcerpt(post.excerpt.rendered)}</p>
                    <Link href={`/tin-tuc/${post.slug}`} className="text-blue-600 font-medium hover:underline">Đọc thêm →</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Không có bài viết nào.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex">
                <Link 
                  href={`/tin-tuc?page=${1}`}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-l-md hover:bg-gray-50"
                >
                  Đầu
                </Link>
                {/* We would generate page links here based on totalPages */}
                <Link 
                  href={`/tin-tuc?page=${totalPages}`}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-r-md hover:bg-gray-50"
                >
                  Cuối
                </Link>
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/tin-tuc/danh-muc/${category.slug}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {category.name} ({category.count})
                    </Link>
                  </li>
                ))
              ) : (
                <li>Không có danh mục nào.</li>
              )}
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Bài viết gần đây</h3>
            <ul className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <li key={post.id}>
                  <Link 
                    href={`/tin-tuc/${post.slug}`}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {post.title.rendered}
                  </Link>
                  <p className="text-gray-500 text-sm">{formatDate(post.date)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
