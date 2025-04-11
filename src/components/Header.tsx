'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getMenuItems, getGlobalSettings } from '@/lib/api';

interface MenuItem {
  id: number;
  title: string;
  url: string;
}

interface GlobalSettings {
  site_logo?: {
    url: string;
    alt: string;
  };
  site_name?: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<MenuItem[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({});
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Default navigation items as fallback
  const defaultNavigation = [
    { id: 1, title: 'Trang chủ', url: '/' },
    { id: 2, title: 'Giới thiệu', url: '/gioi-thieu' },
    { id: 3, title: 'Sản phẩm', url: '/san-pham' },
    { id: 4, title: 'Dịch Vụ', url: '/dich-vu' },
    { id: 5, title: 'Tin Tức', url: '/tin-tuc' },
    { id: 6, title: 'Liên hệ', url: '/lien-he' },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuData, settings] = await Promise.all([
          getMenuItems('primary-menu'),
          getGlobalSettings()
        ]);

        setNavigationItems(menuData?.items || defaultNavigation);
        setGlobalSettings(settings || {});
      } catch (error) {
        console.error('Error fetching header data:', error);
        setNavigationItems(defaultNavigation);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (url: string) => {
    return pathname === url;
  };

  if (loading) {
    return (
      <header className="bg-white shadow-md animate-pulse">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="h-16 w-48 bg-gray-200 rounded" />
            <div className="hidden md:flex space-x-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 w-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-16 w-48">
              <Image
                src={globalSettings.site_logo?.url || '/logo.png'}
                alt={globalSettings.site_logo?.alt || globalSettings.site_name || 'Sao Nam TG'}
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
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-150 ${
                  isActiveLink(item.url)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : ''
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
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

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <nav className="mt-4 space-y-3 pb-3">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`block text-gray-700 hover:text-blue-600 font-medium transition duration-150 ${
                  isActiveLink(item.url) ? 'text-blue-600 bg-blue-50 px-4 py-2 rounded' : ''
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
