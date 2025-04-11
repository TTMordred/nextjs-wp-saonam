import Image from "next/image";
import Link from "next/link";
import { getPage, getPosts } from "@/lib/api";
import { extractExcerpt, formatDate } from "@/lib/formatContent";

interface Service {
  title: string;
  description: string;
  icon: string;
  link: string;
}

interface Partner {
  logo: {
    url: string;
    alt: string;
  };
  name: string;
  website?: string;
}

interface HomePageData {
  acf?: {
    hero_title?: string;
    hero_description?: string;
    services?: Service[];
    partners?: Partner[];
    cta_title?: string;
    cta_description?: string;
    cta_button_text?: string;
  };
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

interface Post {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

async function getHomePageData() {
  try {
    const [homePage, postsData] = await Promise.all([
      getPage('homepage'),
      getPosts(1, 3)
    ]);

    return {
      homePage,
      latestPosts: postsData.posts || [],
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      homePage: null,
      latestPosts: [],
    };
  }
}

export default async function Home() {
  const { homePage, latestPosts } = await getHomePageData();
  
  const defaultHeroTitle = "CÔNG TY TNHH SAO NAM TG (STC)";
  const defaultHeroDescription = "Được thành lập vào ngày 01 tháng 08 năm 2000 với mục tiêu: STC là Công ty thành lập để phục vụ khách hàng và cam kết cung cấp cho khách hàng các sản phẩm và dịch vụ hoàn hảo nhất nhằm đem lại sự hài lòng cao nhất từ phía khách hàng.";

  // Default services if not provided by WordPress
  const defaultServices: Service[] = [
    {
      title: "Thiết bị văn phòng",
      description: "Chuyên phân phối thiết bị văn phòng như máy in, máy photo, máy đa chức năng, màn hình chuyên dụng, màn hình tương tác, máy chiếu, ....",
      icon: "desktop",
      link: "/san-pham"
    },
    {
      title: "Hệ thống điện nhẹ (ELV)",
      description: "Cung cấp toàn bộ giải pháp cho Hệ thống điện nhẹ (ELV) như hệ thống camera giám sát (CCTV); hệ thống Âm thanh công cộng (PA); hệ thống mạng (Network); ....",
      icon: "network",
      link: "/dich-vu"
    },
    {
      title: "Dịch vụ trọn gói",
      description: "Cung cấp trọn gói các dịch vụ như tư vấn-thiết kế, cho thuê, triển khai dự án, dịch vụ bảo hành-bảo trì",
      icon: "service",
      link: "/dich-vu"
    }
  ];

  const services = (homePage as HomePageData)?.acf?.services || defaultServices;
  const partners = (homePage as HomePageData)?.acf?.partners || [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {(homePage as HomePageData)?.acf?.hero_title || defaultHeroTitle}
            </h1>
            <p className="text-xl mb-6">
              {(homePage as HomePageData)?.acf?.hero_description || defaultHeroDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/gioi-thieu"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200"
              >
                Tìm hiểu thêm
              </Link>
              <Link
                href="/lien-he"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 transition duration-200"
              >
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Dịch vụ của chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service: Service, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 mb-4">
                  <Image
                    src={service.icon.startsWith('http') ? service.icon : `/${service.icon}.svg`}
                    alt={service.title}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link href={service.link} className="text-blue-600 font-medium hover:underline inline-flex items-center">
                  Xem thêm
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Latest News Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Tin tức mới nhất</h2>
            <Link href="/tin-tuc" className="text-blue-600 font-medium hover:underline">
              Xem tất cả
              <svg className="w-4 h-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.length > 0 ? (
              latestPosts.map((post: Post) => (
                <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  {post.featured_media ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'}
                        alt={post.title.rendered}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <time className="text-gray-500 text-sm mb-2 block">{formatDate(post.date)}</time>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title.rendered}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{extractExcerpt(post.excerpt.rendered)}</p>
                    <Link href={`/tin-tuc/${post.slug}`} className="text-blue-600 font-medium hover:underline inline-flex items-center">
                      Đọc thêm
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">Không có bài viết nào.</p>
            )}
          </div>
        </section>

        {/* Partners Section */}
        {partners.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">Đối tác của chúng tôi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner: Partner, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-16 w-full">
                    <Image
                      src={partner.logo.url}
                      alt={partner.logo.alt || partner.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {(homePage as HomePageData)?.acf?.cta_title || "Bạn cần hỗ trợ?"}
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            {(homePage as HomePageData)?.acf?.cta_description || "Liên hệ với chúng tôi ngay hôm nay để được tư vấn và hỗ trợ về các sản phẩm và dịch vụ."}
          </p>
          <Link
            href="/lien-he"
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-200 inline-flex items-center"
          >
            {(homePage as HomePageData)?.acf?.cta_button_text || "Liên hệ ngay"}
            <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </section>
      </div>
    </main>
  );
}
