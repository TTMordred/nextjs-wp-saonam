import axios from 'axios';

// Types
interface PostQuery {
  category?: string;
  tag?: string;
  search?: string;
  author?: number;
}

interface Term {
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

// Create a base axios instance for WordPress API
const wpApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://saonamtg.com/wp-json/wp/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Basic authentication for protected endpoints
const auth = {
  username: process.env.WP_USERNAME ?? '',
  password: process.env.WP_APP_PASSWORD ?? '',
};

// Fetch pages
export async function getPage(slug: string): Promise<Post | null> {
  try {
    const response = await wpApi.get(`/pages?slug=${slug}&_embed`);
    return response.data[0] ?? null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Fetch all pages
export async function getAllPages(): Promise<ReadonlyArray<Post>> {
  try {
    const response = await wpApi.get('/pages?per_page=100&_embed');
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

    const response = await wpApi.get(`/posts?${queryParams.toString()}`);
    
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
    const response = await wpApi.get(`/posts?slug=${slug}&_embed`);
    return response.data[0] ?? null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fetch categories
export async function getCategories(): Promise<ReadonlyArray<Term>> {
  try {
    const response = await wpApi.get('/categories?per_page=100&hide_empty=true');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch tags
export async function getTags(): Promise<ReadonlyArray<Term>> {
  try {
    const response = await wpApi.get('/tags?per_page=100&hide_empty=true');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Fetch menu items (requires WP REST API Menus plugin)
export async function getMenuItems(location: string) {
  try {
    const response = await wpApi.get(`menus/v1/locations/${location}`, { auth });
    return response.data ?? null;
  } catch (error) {
    console.error(`Error fetching menu for location ${location}:`, error);
    return null;
  }
}

// Fetch media by ID
export async function getMedia(id: number): Promise<Media | null> {
  try {
    const response = await wpApi.get(`/media/${id}`);
    return response.data ?? null;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

// Fetch a user by ID
export async function getUser(id: number): Promise<User | null> {
  try {
    const response = await wpApi.get(`/users/${id}`);
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
    const response = await wpApi.get(`/search?search=${query}&type=${type}&_embed`);
    return response.data ?? [];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

export type { Post, Term, User, Media, PostQuery };