import axios from 'axios';
import cache from './cache';

// WooCommerce Product interfaces
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_modified: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: Array<{
    id: string;
    name: string;
    file: string;
  }>;
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  images: {
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  }[];
  attributes: {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }[];
  default_attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  price_html: string;
  meta_data: Array<{
    id: number;
    key: string;
    value: string | number | boolean | Record<string, unknown>;
  }>;
}

export interface WooProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    date_created: string;
    date_modified: string;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
}

// Create a WooCommerce API client
const woocommerceApi = axios.create({
  baseURL: process.env.WC_API_BASE ?? 'https://saonamtg.com/wp-json/wc/v3',
  timeout: 10000,
});

// Add authentication to requests
woocommerceApi.interceptors.request.use((config) => {
  // Use OAuth 1.0a for WooCommerce REST API
  const params = config.params || {};

  // Add consumer key and secret
  params.consumer_key = process.env.WC_KEY ?? '';
  params.consumer_secret = process.env.WC_SECRET ?? '';

  config.params = params;
  return config;
});

// Get all products with optional filtering
export async function getProducts(options: {
  page?: number;
  per_page?: number;
  category?: number;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  on_sale?: boolean;
  skipCache?: boolean;
} = {}) {
  try {
    // Generate cache key based on options
    const cacheKey = `products_${JSON.stringify(options)}`;

    // Check cache first (unless skipCache is true)
    if (!options.skipCache) {
      const cachedData = cache.get<{
        products: WooProduct[];
        totalPages: number;
        total: number;
      }>(cacheKey);

      if (cachedData) {
        return cachedData;
      }
    }

    const response = await woocommerceApi.get('/products', {
      params: {
        ...options,
        page: options.page ?? 1,
        per_page: options.per_page ?? 12,
      },
    });

    const result = {
      products: response.data as WooProduct[],
      totalPages: parseInt(response.headers['x-wp-totalpages'] ?? '1', 10),
      total: parseInt(response.headers['x-wp-total'] ?? '0', 10),
    };

    // Cache the result for 5 minutes (300 seconds)
    if (!options.skipCache) {
      cache.set(cacheKey, result, 300);
    }

    return result;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalPages: 0, total: 0 };
  }
}

// Get a single product by ID
export async function getProduct(id: number, skipCache = false) {
  try {
    // Check cache first (unless skipCache is true)
    const cacheKey = `product_${id}`;

    if (!skipCache) {
      const cachedProduct = cache.get<WooProduct>(cacheKey);

      if (cachedProduct) {
        return cachedProduct;
      }
    }

    const response = await woocommerceApi.get(`/products/${id}`);
    const product = response.data as WooProduct;

    // Cache the product for 10 minutes (600 seconds)
    if (!skipCache) {
      cache.set(cacheKey, product, 600);
    }

    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

// Get a single product by slug
export async function getProductBySlug(slug: string, skipCache = false) {
  try {
    // Check cache first (unless skipCache is true)
    const cacheKey = `product_slug_${slug}`;

    if (!skipCache) {
      const cachedProduct = cache.get<WooProduct>(cacheKey);

      if (cachedProduct) {
        return cachedProduct;
      }
    }

    const response = await woocommerceApi.get('/products', {
      params: {
        slug,
      },
    });

    const product = response.data[0] as WooProduct || null;

    // Cache the product for 10 minutes (600 seconds)
    if (product && !skipCache) {
      cache.set(cacheKey, product, 600);
    }

    return product;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

// Get product categories
export async function getProductCategories(options: {
  page?: number;
  per_page?: number;
  parent?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
  hide_empty?: boolean;
  skipCache?: boolean;
} = {}) {
  try {
    // Generate cache key based on options
    const cacheKey = `product_categories_${JSON.stringify(options)}`;

    // Check cache first (unless skipCache is true)
    if (!options.skipCache) {
      const cachedData = cache.get<{
        categories: WooProductCategory[];
        totalPages: number;
        total: number;
      }>(cacheKey);

      if (cachedData) {
        return cachedData;
      }
    }

    const response = await woocommerceApi.get('/products/categories', {
      params: {
        ...options,
        page: options.page ?? 1,
        per_page: options.per_page ?? 100,
        hide_empty: options.hide_empty ?? true,
      },
    });

    const result = {
      categories: response.data as WooProductCategory[],
      totalPages: parseInt(response.headers['x-wp-totalpages'] ?? '1', 10),
      total: parseInt(response.headers['x-wp-total'] ?? '0', 10),
    };

    // Cache the result for 15 minutes (900 seconds) as categories change less frequently
    if (!options.skipCache) {
      cache.set(cacheKey, result, 900);
    }

    return result;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return { categories: [], totalPages: 0, total: 0 };
  }
}

// Get related products
export async function getRelatedProducts(productId: number, limit = 4, skipCache = false) {
  try {
    // Check cache first (unless skipCache is true)
    const cacheKey = `related_products_${productId}_${limit}`;

    if (!skipCache) {
      const cachedProducts = cache.get<WooProduct[]>(cacheKey);

      if (cachedProducts) {
        return cachedProducts;
      }
    }

    const product = await getProduct(productId, skipCache);
    if (!product) return [];

    // Get products from the same categories
    const categoryIds = product.categories.map(cat => cat.id);
    if (categoryIds.length === 0) return [];

    const { products } = await getProducts({
      category: categoryIds[0], // Use the first category
      per_page: limit + 1, // Fetch one extra to filter out the current product
      skipCache,
    });

    // Filter out the current product and limit the results
    const relatedProducts = products
      .filter(p => p.id !== productId)
      .slice(0, limit);

    // Cache the result for 10 minutes (600 seconds)
    if (!skipCache) {
      cache.set(cacheKey, relatedProducts, 600);
    }

    return relatedProducts;
  } catch (error) {
    console.error(`Error fetching related products for product ${productId}:`, error);
    return [];
  }
}

const wooCommerceService = {
  getProducts,
  getProduct,
  getProductBySlug,
  getProductCategories,
  getRelatedProducts,
};

export default wooCommerceService;
