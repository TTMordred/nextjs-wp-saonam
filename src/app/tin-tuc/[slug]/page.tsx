import { getPost, getPosts } from '@/lib/api';
import { formatDate } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
      description: 'Không tìm thấy bài viết này.',
    };
  }
  
  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
      images: post._embedded?.['wp:featuredmedia']?.[0]?.source_url 
        ? [{ url: post._embedded['wp:featuredmedia'][0].source_url }] 
        : [],
    },
  };
}

async function getPostData(slug) {
  // Fetch the post
  const post = await getPost(slug);
  
  // Fetch recent posts for sidebar
  const { posts: recentPosts } = await getPosts(1, 5);
  
  return {
    post,
    recentPosts: recentPosts || [],
  };
}

export default async function PostPage({ params }) {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-3/4">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured image */}
            {post.featured_media && post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <div className="relative h-96 w-full">
                <Image 
                  src={post._embedded['wp:featuredmedia'][0].source_url}
                  alt={post.title.rendered}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Post meta */}
              <div className="mb-6">
                <p className="text-gray-500">
                  Đăng ngày {formatDate(post.date)}
                  {post._embedded?.['wp:term']?.[0]?.length > 0 && (
                    <>
                      {' '}trong{' '}
                      {post._embedded['wp:term'][0].map((category, index) => (
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
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
              
              {/* Tags */}
              {post._embedded?.['wp:term']?.[1]?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold mb-2">Thẻ:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post._embedded['wp:term'][1].map((tag) => (
                      <Link 
                        key={tag.id}
                        href={`/tin-tuc/tag/${tag.slug}`}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
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
              className="text-blue-600 hover:underline"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/4">
          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Bài viết gần đây</h3>
            <ul className="space-y-4">
              {recentPosts.map((recentPost) => (
                <li key={recentPost.id}>
                  <Link 
                    href={`/tin-tuc/${recentPost.slug}`}
                    className={`text-gray-700 hover:text-blue-600 ${recentPost.id === post.id ? 'font-bold' : ''}`}
                  >
                    {recentPost.title.rendered}
                  </Link>
                  <p className="text-gray-500 text-sm">{formatDate(recentPost.date)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
