'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hardcoded navigation items as requested
  const navigationItems = [
    { id: 1, title: 'Trang chủ', url: '/' },
    { id: 2, title: 'Giới thiệu', url: '/gioi-thieu' },
    { id: 3, title: 'Sản phẩm', url: '/san-pham' },
    { id: 4, title: 'Dịch Vụ', url: '/dich-vu' },
    { id: 5, title: 'Tin Tức', url: '/tin-tuc' },
    { id: 6, title: 'Liên hệ', url: '/lien-he' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (url: string) => {
    // Fix the active link detection to handle nested paths
    if (url === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(url);
  };

  // Hardcoded logo URL as requested
  const logoUrl = "https://saonamtg.com/wp-content/uploads/2023/04/Chua-co-ten-500-%C3%97-300-px.png";

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-[72px]">
      {/* Top red border */}
      <div className="h-1 bg-red-600"></div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 block">
            <div className="relative w-[160px] h-[50px]">
              <Image
                src={logoUrl}
                alt="Sao Nam TG"
                fill
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                priority
                sizes="160px"
                className="max-h-[50px] w-auto"
              />
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation - Limit to 6 items */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`text-gray-700 hover:text-red-600 transition duration-200 text-sm tracking-wide py-2 ${
                    isActiveLink(item.url)
                      ? 'text-red-600 font-semibold border-b-2 border-red-600'
                      : 'font-medium'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Search Box */}
            <div className="hidden md:flex items-center border border-gray-300 rounded-full overflow-hidden hover:border-gray-400 transition-colors bg-gray-50">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="px-4 py-1.5 focus:outline-none text-sm w-40 bg-transparent placeholder-gray-500"
              />
              <button 
                className="bg-red-50 text-red-600 px-3 py-1.5 hover:bg-red-100 transition-colors flex items-center justify-center"
                aria-label="Tìm kiếm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Also limit to 6 items */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t mt-4 bg-white absolute top-full left-0 right-0 shadow-lg">
            {navigationItems.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`block px-4 py-2.5 text-gray-800 hover:text-red-600 hover:bg-red-50 transition duration-150 ${
                  isActiveLink(item.url) ? 'text-red-600 border-l-3 border-red-600 pl-3 bg-red-50 font-semibold' : 'font-medium'
                }`}
              >
                {item.title}
              </Link>
            ))}

            {/* Mobile Search */}
            <div className="px-4 py-4">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-gray-50">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="px-4 py-2 w-full focus:outline-none text-sm bg-transparent placeholder-gray-500"
                />
                <button 
                  className="bg-red-100 text-red-600 px-4 py-2 hover:bg-red-200 transition-colors"
                  aria-label="Tìm kiếm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
