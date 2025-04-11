import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Không tìm thấy trang</h1>
        <div className="relative h-64 w-64 mx-auto mb-8">
          <Image
            src="/404.png"
            alt="404 Not Found"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tin-tuc"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition duration-200"
          >
            Quay lại trang Tin tức
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition duration-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}