import Image from "next/image";
import Link from "next/link";
import { getPage, getPosts } from "@/lib/api";
import { formatContent, extractExcerpt, formatDate } from "@/lib/formatContent";

async function getHomePageData() {
  // Fetch homepage content from WordPress
  const homePage = await getPage('homepage');

  // Fetch latest posts
  const { posts } = await getPosts(1, 3);

  return {
    homePage,
    latestPosts: posts || [],
  };
}

export default async function Home() {
  const { homePage, latestPosts } = await getHomePageData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">CÔNG TY TNHH SAO NAM TG (STC)</h1>
          <p className="text-xl mb-6">
            Được thành lập vào ngày 01 tháng 08 năm 2000 với mục tiêu: STC là Công ty thành lập để phục vụ khách hàng và cam kết cung cấp cho khách hàng các sản phẩm và dịch vụ hoàn hảo nhất nhằm đem lại sự hài lòng cao nhất từ phía khách hàng.
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

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Dịch vụ của chúng tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Thiết bị văn phòng</h3>
            <p className="text-gray-600 mb-4">Chuyên phân phối thiết bị văn phòng như máy in, máy photo, máy đa chức năng, màn hình chuyên dụng, màn hình tương tác, máy chiếu, ….</p>
            <Link href="/san-pham" className="text-blue-600 font-medium hover:underline">Xem thêm →</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Hệ thống điện nhẹ (ELV)</h3>
            <p className="text-gray-600 mb-4">Cung cấp toàn bộ giải pháp cho Hệ thống điện nhẹ (ELV) như hệ thống camera giám sát (CCTV); hệ thống Âm thanh công cộng (PA); hệ thống mạng (Network); ….</p>
            <Link href="/dich-vu" className="text-blue-600 font-medium hover:underline">Xem thêm →</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Dịch vụ trọn gói</h3>
            <p className="text-gray-600 mb-4">Cung cấp trọn gói các dịch vụ như tư vấn-thiết kế, cho thuê, triển khai dự án, dịch vụ bảo hành-bảo trì</p>
            <Link href="/dich-vu" className="text-blue-600 font-medium hover:underline">Xem thêm →</Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Tin tức mới nhất</h2>
          <Link href="/tin-tuc" className="text-blue-600 font-medium hover:underline">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
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
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">Không có bài viết nào.</p>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Đối tác của chúng tôi</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image
                src="/placeholder-logo.png"
                alt="Partner Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image
                src="/placeholder-logo.png"
                alt="Partner Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image
                src="/placeholder-logo.png"
                alt="Partner Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
            <div className="relative h-16 w-full">
              <Image
                src="/placeholder-logo.png"
                alt="Partner Logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Bạn cần hỗ trợ?</h2>
        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">Liên hệ với chúng tôi ngay hôm nay để được tư vấn và hỗ trợ về các sản phẩm và dịch vụ.</p>
        <Link
          href="/lien-he"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-200 inline-block"
        >
          Liên hệ ngay
        </Link>
      </section>
    </div>
  );
}
