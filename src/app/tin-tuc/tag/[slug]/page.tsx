import { Metadata } from 'next';
import { getPosts, type Term } from '@/lib/api';
import { getTags } from '@/lib/wordpress';
import { formatDate, extractExcerpt } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

interface TagParams {
  readonly params: {
    slug: string;
  };
  readonly searchParams: {
    page?: string;
  };
}

const POSTS_PER_PAGE = 9;

// Generate static paths for all tags
export async function generateStaticParams() {
  try {
    const tags = await getTags();
    return tags.map((tag: Term) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for the tag page
export async function generateMetadata({ params }: TagParams): Promise<Metadata> {
  try {
    const tags = await getTags();
    const tag = tags.find((t: Term) => t.slug === params.slug);

    if (!tag) {
      return {
        title: 'Thẻ không tồn tại | Sao Nam TG',
        description: 'Không tìm thấy thẻ này.',
      };
    }

    return {
      title: `${tag.name} | Tin tức | Sao Nam TG`,
      description: tag.description ?? `Xem tất cả bài viết với thẻ ${tag.name}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tin tức | Sao Nam TG',
      description: 'Đọc tin tức mới nhất từ Sao Nam TG',
    };
  }
}

async function getTagData(slug: string, page = 1) {
  try {
    const [tags, postsData] = await Promise.all([
      getTags(),
      getPosts(page, POSTS_PER_PAGE, { tag: slug }),
    ]);

    const tag = tags.find((t: Term) => t.slug === slug);

    return {
      tag,
      posts: postsData.posts ?? [],
      totalPages: postsData.totalPages ?? 1,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching tag data:', error);
    return {
      tag: null,
      posts: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
}

export default async function TagPage({ params, searchParams }: Readonly<TagParams>) {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { tag, posts, totalPages } = await getTagData(params.slug, currentPage);

  if (!tag) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Thẻ không tồn tại</h1>
          <p className="text-lg mb-8">Không tìm thấy thẻ bạn đang tìm kiếm.</p>
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
      {/* Tag Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Bài viết với thẻ: {tag.name}
        </h1>
        {tag.description && (
          <p className="text-lg text-gray-600">{tag.description}</p>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {!!(post.featured_media && post._embedded?.['wp:featuredmedia']?.[0]) && (
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
            Chưa có bài viết nào với thẻ này.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/tin-tuc/tag/${params.slug}?page=${currentPage - 1}`}
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
              href={`/tin-tuc/tag/${params.slug}?page=${currentPage + 1}`}
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