import { getPage } from '@/lib/api';
import { formatContent } from '@/lib/formatContent';
import Image from 'next/image';

async function getAboutPageData() {
  // Fetch about page content from WordPress
  const aboutPage = await getPage('gioi-thieu');
  return aboutPage;
}

export default async function AboutPage() {
  const aboutPage = await getAboutPageData();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Giới thiệu</h1>
        
        {aboutPage ? (
          <div>
            {/* If we have WordPress content, render it */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: aboutPage.content.rendered }}
            />
          </div>
        ) : (
          // Fallback content if WordPress page is not available
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">CÔNG TY TNHH SAO NAM TG (STC)</h2>
              <p className="mb-4">
                Được thành lập vào ngày 01 tháng 08 năm 2000 với mục tiêu: STC là Công ty thành lập để phục vụ khách hàng và cam kết cung cấp cho khách hàng các sản phẩm và dịch vụ hoàn hảo nhất nhằm đem lại sự hài lòng cao nhất từ phía khách hàng.
              </p>
              <p className="mb-4">
                Để duy trì được điều này, STC đã không ngừng đưa ra các giải pháp và phương thức phục vụ tối ưu bằng việc nâng cao trình độ đội ngũ cán bộ kỹ thuật.
              </p>
              <p>
                Với đội ngũ cán bộ kỹ thuật có trình độ cao và kinh nghiệm này, STC sẵn sàng đáp ứng mọi yêu cầu của khách hàng cho việc bảo hành, bảo trì, sửa chữa cũng như tư vấn và hỗ trợ khách hàng lựa chọn thiết bị phù hợp nhất với nhu cầu công việc nhằm giúp khách hàng tiết kiệm tối đa chi phí mà đạt hiệu quả công việc cao nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">20+</div>
                <p className="text-lg font-medium">Năm hoạt động và phát triển</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">100+</div>
                <p className="text-lg font-medium">Dự án đã triển khai</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">50+</div>
                <p className="text-lg font-medium">Đối tác tin cậy</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Tầm nhìn & Sứ mệnh</h2>
              <p className="mb-4">
                <strong>Tầm nhìn:</strong> Trở thành đơn vị hàng đầu trong lĩnh vực cung cấp thiết bị văn phòng và giải pháp công nghệ tại khu vực Đồng bằng sông Cửu Long.
              </p>
              <p>
                <strong>Sứ mệnh:</strong> Cung cấp các sản phẩm và dịch vụ chất lượng cao, đáp ứng nhu cầu đa dạng của khách hàng, góp phần nâng cao hiệu quả công việc và phát triển bền vững.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Giá trị cốt lõi</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chất lượng:</strong> Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao.</li>
                <li><strong>Chuyên nghiệp:</strong> Đội ngũ nhân viên được đào tạo bài bản, làm việc chuyên nghiệp.</li>
                <li><strong>Tận tâm:</strong> Luôn đặt lợi ích của khách hàng lên hàng đầu.</li>
                <li><strong>Đổi mới:</strong> Không ngừng cập nhật công nghệ và giải pháp mới.</li>
                <li><strong>Trách nhiệm:</strong> Thực hiện đúng cam kết với khách hàng và đối tác.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
