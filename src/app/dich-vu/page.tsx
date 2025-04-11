import { getPage } from '@/lib/api';
import { formatContent } from '@/lib/formatContent';
import Image from 'next/image';
import Link from 'next/link';

async function getServicesPageData() {
  // Fetch services page content from WordPress
  const servicesPage = await getPage('dich-vu');
  return servicesPage;
}

export default async function ServicesPage() {
  const servicesPage = await getServicesPageData();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Dịch vụ</h1>
      
      {servicesPage ? (
        <div>
          {/* If we have WordPress content, render it */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: servicesPage.content.rendered }}
          />
        </div>
      ) : (
        // Fallback content if WordPress page is not available
        <div>
          {/* Hero section */}
          <div className="bg-blue-600 text-white rounded-lg p-8 mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Giải pháp & Dịch vụ</h2>
              <p className="text-xl mb-6">
                Chúng tôi cung cấp đa dạng các giải pháp và dịch vụ chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.
              </p>
            </div>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bảo trì hệ thống mạng, máy tính, máy chiếu</h3>
              <p className="text-gray-600 mb-4">
                Chúng tôi cung cấp dịch vụ bảo trì, sửa chữa và nâng cấp hệ thống mạng, máy tính và máy chiếu cho doanh nghiệp và cá nhân. Đội ngũ kỹ thuật viên giàu kinh nghiệm sẽ giúp hệ thống của bạn luôn hoạt động ổn định và hiệu quả.
              </p>
              <Link href="/bao-tri-he-thong-mang-may-tinh-may-chieu" className="text-blue-600 font-medium hover:underline">Xem chi tiết →</Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bảo trì, sửa chữa máy Photocopy</h3>
              <p className="text-gray-600 mb-4">
                Dịch vụ bảo trì và sửa chữa máy Photocopy chuyên nghiệp, nhanh chóng. Chúng tôi cung cấp dịch vụ cho tất cả các thương hiệu máy Photocopy phổ biến như Konica Minolta, Canon, Ricoh, Xerox, và nhiều hãng khác.
              </p>
              <Link href="/bao-tri-sua-chua-may-photocopy" className="text-blue-600 font-medium hover:underline">Xem chi tiết →</Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Chính sách bảo hành</h3>
              <p className="text-gray-600 mb-4">
                Chúng tôi cam kết cung cấp chính sách bảo hành rõ ràng và minh bạch cho tất cả sản phẩm. Với đội ngũ kỹ thuật viên chuyên nghiệp, chúng tôi đảm bảo xử lý các vấn đề bảo hành nhanh chóng và hiệu quả.
              </p>
              <Link href="/chinh-sach-bao-hanh" className="text-blue-600 font-medium hover:underline">Xem chi tiết →</Link>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Lắp đặt hệ thống camera giám sát</h3>
              <p className="text-gray-600 mb-4">
                Chúng tôi cung cấp dịch vụ tư vấn, thiết kế và lắp đặt hệ thống camera giám sát (CCTV) cho văn phòng, cửa hàng, nhà xưởng và nhà ở. Giải pháp an ninh toàn diện, hiện đại và đáng tin cậy.
              </p>
              <Link href="/lap-dat-he-thong-camera-giam-sat" className="text-blue-600 font-medium hover:underline">Xem chi tiết →</Link>
            </div>
          </div>

          {/* Why choose us section */}
          <div className="bg-gray-100 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Tại sao chọn chúng tôi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Chất lượng hàng đầu</h3>
                <p className="text-gray-600">Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao, đáp ứng tiêu chuẩn quốc tế.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Phản hồi nhanh chóng</h3>
                <p className="text-gray-600">Đội ngũ kỹ thuật viên luôn sẵn sàng hỗ trợ và xử lý sự cố trong thời gian ngắn nhất.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Đội ngũ chuyên nghiệp</h3>
                <p className="text-gray-600">Nhân viên được đào tạo bài bản, có kinh nghiệm và chuyên môn cao trong lĩnh vực.</p>
              </div>
            </div>
          </div>

          {/* CTA section */}
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Bạn cần tư vấn về dịch vụ?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí và nhận báo giá chi tiết.</p>
            <Link 
              href="/lien-he" 
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200 inline-block"
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
