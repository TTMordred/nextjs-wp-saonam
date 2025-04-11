import axios from 'axios';

// Create a base axios instance for WordPress API
const wpApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WP_API_URL || 'https://saonamtg.com/wp-json/wp/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication for protected endpoints if needed
const getAuthHeader = () => {
  const username = process.env.WP_USERNAME;
  const password = process.env.WP_APP_PASSWORD;
  
  if (username && password) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    return { Authorization: `Basic ${token}` };
  }
  
  return {};
};

// Error handler
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
  return null;
};

// Fetch pages with ACF fields
export async function getPage(slug) {
  try {
    const response = await wpApi.get(`/pages?slug=${slug}&_embed&acf_format=standard`);
    if (!response.data.length) return null;
    
    const page = response.data[0];
    return {
      ...page,
      featuredImage: page._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      acf: page.acf || {},
    };
  } catch (error) {
    return handleError(error, 'getPage');
  }
}

// Fetch all pages
export async function getAllPages() {
  try {
    const response = await wpApi.get('/pages?per_page=100&_embed&acf_format=standard');
    return response.data.map(page => ({
      ...page,
      featuredImage: page._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      acf: page.acf || {},
    }));
  } catch (error) {
    return handleError(error, 'getAllPages') || [];
  }
}

// Fetch posts with pagination and categories
export async function getPosts(page = 1, perPage = 10, categoryId = null) {
  try {
    let endpoint = `/posts?page=${page}&per_page=${perPage}&_embed&acf_format=standard`;
    if (categoryId) endpoint += `&categories=${categoryId}`;

    const response = await wpApi.get(endpoint);
    const posts = response.data.map(post => ({
      ...post,
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      categories: post._embedded?.['wp:term']?.[0] || [],
      acf: post.acf || {},
    }));

    return {
      posts,
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1', 10),
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
    };
  } catch (error) {
    return handleError(error, 'getPosts') || { posts: [], totalPages: 0, total: 0 };
  }
}

// Fetch a single post by slug
export async function getPost(slug) {
  try {
    const response = await wpApi.get(`/posts?slug=${slug}&_embed&acf_format=standard`);
    if (!response.data.length) return null;

    const post = response.data[0];
    return {
      ...post,
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      categories: post._embedded?.['wp:term']?.[0] || [],
      acf: post.acf || {},
    };
  } catch (error) {
    return handleError(error, 'getPost');
  }
}

// Fetch all media items
export async function getAllMedia(page = 1, perPage = 100) {
  try {
