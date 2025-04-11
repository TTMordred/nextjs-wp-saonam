import axios from 'axios';

// Types
interface PostQuery {
  category?: string;
  tag?: string;
  search?: string;
  author?: number;
}

export interface Term {
  id: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

interface Post {
  id: number;
  title: {
    readonly rendered: string;
  };
  content: {
    readonly rendered: string;
  };
  excerpt: {
    readonly rendered: string;
  };
  slug: string;
  date: string;
  featured_media: number;
  _embedded?: {
    readonly 'wp:featuredmedia'?: ReadonlyArray<{
      source_url: string;
      alt_text?: string;
    }>;
    readonly 'wp:term'?: ReadonlyArray<ReadonlyArray<Term>>;
  };
}

interface User {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly avatar_urls?: {
    readonly [key: string]: string;
  };
}

interface Media {
  readonly id: number;
  readonly source_url: string;
  readonly alt_text?: string;
  readonly media_details?: {
    readonly width: number;
    readonly height: number;
    readonly sizes?: {
      readonly [key: string]: {
        readonly source_url: string;
        readonly width: number;
        readonly height: number;
      };
    };
  };
}

// Create base axios instances for WordPress API
const wpApiV2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://saonamtg.com/wp-json/wp/v2',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// For custom endpoints and other namespaces
const wpApiCustom = axios.create({
  baseURL: 'https://saonamtg.com/wp-json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Basic authentication for protected endpoints
// Uncomment and use this when you need to access protected endpoints
// const auth = {
//   username: process.env.WP_USERNAME ?? '',
//   password: process.env.WP_APP_PASSWORD ?? '',
// };

// Fetch pages
export async function getPage(slug: string): Promise<Post | null> {
  try {
    const response = await wpApiV2.get(`/pages?slug=${slug}&_embed`);
    return response.data[0] ?? null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Fetch all pages
export async function getAllPages(): Promise<ReadonlyArray<Post>> {
  try {
    const response = await wpApiV2.get('/pages?per_page=100&_embed');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

// Fetch posts with pagination and filtering
export async function getPosts(
  page = 1,
  perPage = 10,
  query: Readonly<PostQuery> = {}
) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      _embed: 'true',
    });

    // Add optional query parameters
    if (query.category) {
      const categories = await getCategories();
      const category = categories.find((cat: Term) => cat.slug === query.category);
      if (category) {
        queryParams.append('categories', category.id.toString());
      }
    }

    if (query.tag) {
      const tags = await getTags();
      const tag = tags.find((t: Term) => t.slug === query.tag);
      if (tag) {
        queryParams.append('tags', tag.id.toString());
      }
    }

    if (query.search) {
      queryParams.append('search', query.search);
    }

    if (query.author) {
      queryParams.append('author', query.author.toString());
    }

    const response = await wpApiV2.get(`/posts?${queryParams.toString()}`);

    return {
      posts: response.data as ReadonlyArray<Post>,
      totalPages: Number(response.headers['x-wp-totalpages'] ?? 1),
      total: Number(response.headers['x-wp-total'] ?? 0),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], totalPages: 0, total: 0 };
  }
}

// Fetch a single post by slug
export async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await wpApiV2.get(`/posts?slug=${slug}&_embed`);
    return response.data[0] ?? null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fetch categories
export async function getCategories(): Promise<ReadonlyArray<Term>> {
  try {
    const response = await wpApiV2.get('/categories?per_page=100');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch product categories
export async function getProductCategories(): Promise<ReadonlyArray<Term>> {
  try {
    // Try to fetch product categories from WooCommerce API
    try {
      const response = await wpApiCustom.get('/wc/v3/products/categories?per_page=100');
      return response.data ?? [];
    } catch (error) {
      console.log('WooCommerce API not available, trying taxonomy endpoint...', error);

      // Fallback to product_cat taxonomy if WooCommerce API is not available
      const response = await wpApiV2.get('/product_cat?per_page=100');
      return response.data ?? [];
    }
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
}

// Fetch tags
export async function getTags(): Promise<ReadonlyArray<Term>> {
  try {
    const response = await wpApiV2.get('/tags?per_page=100&hide_empty=true');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Fetch menu items (requires WP REST API Menus plugin)
export async function getMenuItems(location: string) {
  try {
    // Try multiple approaches to get menu items
    try {
      // First try WP REST API Menus plugin endpoint
      const menuResponse = await wpApiCustom.get(`/menus/v1/locations/${location}`);
      if (menuResponse.data?.items?.length > 0) {
        return menuResponse.data;
      }
    } catch {
      console.log(`Menu plugin endpoint not available for ${location}, trying alternative...`);
    }

    // Try to get pages and create a menu from them
    try {
      const pagesResponse = await wpApiV2.get('/pages?per_page=20&_fields=id,title,slug&orderby=menu_order&order=asc');
      if (pagesResponse.data?.length > 0) {
        return {
          items: pagesResponse.data.map((page: { id: number; title: { rendered: string }; slug: string }, index: number) => ({
            id: page.id,
            title: page.title.rendered,
            url: `/${page.slug === 'home' ? '' : page.slug}`,
            order: index + 1
          }))
        };
      }
    } catch (pagesError) {
      console.error('Error fetching pages for menu:', pagesError);
    }
  } catch (error) {
    console.error(`Error fetching menu for location ${location}:`, error);
  }

  // Return default menu items if all attempts fail
  return {
    items: [
      { id: 1, title: 'Trang chủ', url: '/' },
      { id: 2, title: 'Giới thiệu', url: '/gioi-thieu' },
      { id: 3, title: 'Sản phẩm', url: '/san-pham' },
      { id: 4, title: 'Dịch Vụ', url: '/dich-vu' },
      { id: 5, title: 'Tin Tức', url: '/tin-tuc' },
      { id: 6, title: 'Liên hệ', url: '/lien-he' },
    ]
  };
}

// Fetch media by ID
export async function getMedia(id: number): Promise<Media | null> {
  try {
    const response = await wpApiV2.get(`/media/${id}`);
    return response.data ?? null;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

// Fetch a user by ID
export async function getUser(id: number): Promise<User | null> {
  try {
    const response = await wpApiV2.get(`/users/${id}`);
    return response.data ?? null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Search content
export async function searchContent(
  query: string,
  type = 'post'
): Promise<ReadonlyArray<Post>> {
  try {
    const response = await wpApiV2.get(`/search?search=${query}&type=${type}&_embed`);
    return response.data ?? [];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

// Fetch global settings (site title, logo, etc.)
export async function getGlobalSettings() {
  try {
    // Try multiple approaches to get site settings
    try {
      // First try ACF endpoint if available
      const acfResponse = await wpApiCustom.get('/acf/v3/options/options');
      if (acfResponse.data?.acf) {
        // Ensure logo URL is absolute
        if (acfResponse.data.acf.site_logo?.url && !acfResponse.data.acf.site_logo.url.startsWith('http')) {
          acfResponse.data.acf.site_logo.url = `https://saonamtg.com${acfResponse.data.acf.site_logo.url}`;
        }
        return acfResponse.data.acf;
      }
    } catch (acfError) {
      console.log('ACF options not available, trying site info...', acfError);
    }

    // Fallback to basic site info
    const siteResponse = await wpApiCustom.get('/');
    if (siteResponse.data) {
      const { name, description, url, site_logo_url } = siteResponse.data;
      let logoUrl = site_logo_url;

      // Ensure logo URL is absolute
      if (logoUrl && !logoUrl.startsWith('http')) {
        logoUrl = `https://saonamtg.com${logoUrl}`;
      }

      return {
        site_name: name,
        site_description: description,
        site_url: url,
        site_logo: logoUrl ? {
          url: logoUrl,
          alt: name
        } : {
          url: '/logo.png',
          alt: name || 'Sao Nam TG Logo'
        }
      };
    }
  } catch (error) {
    console.error('Error fetching global settings:', error);
  }

  // Return default values if all attempts fail
  return {
    site_name: 'Sao Nam TG',
    site_description: 'Công ty TNHH Thương mại và Dịch vụ Sao Nam',
    site_logo: {
      url: '/logo.png',
      alt: 'Sao Nam TG Logo'
    },
    contact_email: 'info@saonamtg.com',
    contact_phone: '0123456789',
    social_links: []
  };
}

export type { Post, User, Media, PostQuery };