import { Metadata } from 'next';
import { getPost, getPosts, type Post, type Term } from '@/lib/api';
import { formatContent, formatDate } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

interface PostParams {
  readonly params: {
    slug: string;
  };
}

// Generate static paths for all posts
export async function generateStaticParams() {
  try {
    const { posts } = await getPosts(1, 100); // Fetch up to 100 posts
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  try {
    const post = await getPost(params.slug);
    
    if (!post) {
      return {
        title: 'Bài viết không tồn tại | Sao Nam TG',
        description: 'Không tìm thấy bài viết này.',
      };
    }

    const description = post.excerpt.rendered
      .replace(/<[^>]*>/g, '')
      .slice(0, 160);

    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const categories = post._embedded?.['wp:term']?.[0] ?? [];
    const firstCategory = categories[0]?.name ?? '';

    return {
      title: `${post.title.rendered} | Tin tức | Sao Nam TG`,
      description,
      openGraph: {
        title: post.title.rendered,
        description,
        type: 'article',
        publishedTime: post.date,
        tags: categories.map((cat: Term) => cat.name),
        images: featuredImage ? [{ url: featuredImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description,
        images: featuredImage ? [featuredImage] : [],
      },
      category: firstCategory,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tin tức | Sao Nam TG',
      description: 'Đọc tin tức mới nhất từ Sao Nam TG',
    };
  }
}

async function getPostData(slug: string) {
  try {
    const [post, recentPostsData] = await Promise.all([
      getPost(slug),
      getPosts(1, 5),
    ]);
    
    return {
      post,
      recentPosts: recentPostsData.posts ?? [],
    };
  } catch (error) {
    console.error('Error fetching post data:', error);
    return {
      post: null,
      recentPosts: [],
    };
  }
}

export default async function PostPage({ params }: Readonly<PostParams>) {
  const { post, recentPosts } = await getPostData(params.slug);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Bài viết không tồn tại</h1>
          <p className="text-lg mb-8">Không tìm thấy bài viết bạn đang tìm kiếm.</p>
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

  const categories = post._embedded?.['wp:term']?.[0] ?? [];
  const tags = post._embedded?.['wp:term']?.[1] ?? [];
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-3/4">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured image */}
            {featuredImage && (
              <div className="relative h-[480px] w-full">
                <Image 
                  src={featuredImage.source_url}
                  alt={featuredImage.alt_text ?? post.title.rendered}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Post meta */}
              <div className="mb-6">
                <p className="text-gray-500">
                  Đăng ngày {formatDate(post.date)}
                  {categories.length > 0 && (
                    <>
                      {' '}trong{' '}
                      {categories.map((category: Term, index: number) => (
                        <span key={category.id}>
                          {index > 0 && ', '}
                          <Link 
                            href={`/tin-tuc/danh-muc/${category.slug}`}
                            className="text-blue-600 hover:underline"
                          >
                            {category.name}
                          </Link>
                        </span>
                      ))}
                    </>
                  )}
                </p>
              </div>
              
              {/* Post title */}
              <h1 className="text-3xl font-bold mb-6">{post.title.rendered}</h1>
              
              {/* Post content */}
              <div 
                className="prose prose-lg max-w-none prose-img:rounded-lg prose-headings:text-gray-900 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(post.content.rendered)
                }}
              />
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold mb-2">Thẻ:</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: Term) => (
                      <Link 
                        key={tag.id}
                        href={`/tin-tuc/tag/${tag.slug}`}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition duration-200"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
          
          {/* Post navigation */}
          <div className="flex justify-between mt-8">
            <Link 
              href="/tin-tuc"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Quay lại danh sách
            </Link>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/4">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Bài viết gần đây</h3>
            <ul className="space-y-4">
              {recentPosts.map((recentPost: Post) => (
                <li key={recentPost.id}>
                  <Link 
                    href={`/tin-tuc/${recentPost.slug}`}
                    className={`block text-gray-700 hover:text-blue-600 transition duration-200 ${
                      recentPost.id === post.id ? 'font-bold text-blue-600' : ''
                    }`}
                  >
                    {recentPost.title.rendered}
                    <p className="text-gray-500 text-sm mt-1">{formatDate(recentPost.date)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
