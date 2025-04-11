'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header({ menu }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If no menu is provided, use a default structure
  const navigationItems = menu || [
    { id: 1, title: 'Trang chủ', url: '/' },
    { id: 2, title: 'Giới thiệu', url: '/gioi-thieu' },
    { id: 3, title: 'Sản phẩm', url: '/san-pham' },
    { id: 4, title: 'Dịch Vụ', url: '/dich-vu' },
    { id: 5, title: 'Tin Tức', url: '/tin-tuc' },
    { id: 6, title: 'Liên hệ', url: '/lien-he' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-16 w-48">
              <Image 
                src="/logo.png" 
                alt="Sao Nam TG" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.url}
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-150"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-3">
            {navigationItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.url}
                className="block text-gray-700 hover:text-blue-600 font-medium transition duration-150"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
