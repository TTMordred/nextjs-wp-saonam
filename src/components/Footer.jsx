import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">CÔNG TY TNHH SAO NAM TG (STC)</h3>
            <p className="mb-2">Được thành lập vào ngày 01 tháng 08 năm 2000 với mục tiêu: STC là Công ty thành lập để phục vụ khách hàng và cam kết cung cấp cho khách hàng các sản phẩm và dịch vụ hoàn hảo nhất.</p>
            <p className="font-bold mt-4">STC LUÔN QUAN TÂM ĐẾN LỢI ÍCH KHÁCH HÀNG</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Giải pháp & Dịch vụ</h3>
            <ul className="space-y-2">
              <li>Chuyên phân phối thiết bị văn phòng như máy in, máy photo, máy đa chức năng, màn hình chuyên dụng, màn hình tương tác, máy chiếu, ….</li>
              <li>Cung cấp toàn bộ giải pháp cho Hệ thống điện nhẹ (ELV) như hệ thống camera giám sát (CCTV); hệ thống Âm thanh công cộng (PA); hệ thống mạng (Network); ….</li>
              <li>Cung cấp trọn gói các dịch vụ như tư vấn-thiết kế, cho thuê, triển khai dự án, dịch vụ bảo hành-bảo trì</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ - Tư vấn - Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>Địa chỉ: 118/3A Lý Thường Kiệt, P5, TP. Mỹ Tho, Tiền Giang</li>
              <li>Điện thoại: 0273.397.0444 - 0273.397.0445</li>
              <li>Hotline: 02736.155.255</li>
              <li>E-mail: saonam@saonamtg.com</li>
              <li>Website: www.saonamtg.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>Copyright © {new Date().getFullYear()} <strong>Sao Nam TG</strong></p>
        </div>
      </div>
    </footer>
  );
}
