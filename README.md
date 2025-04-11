# Sao Nam TG - Next.js + WordPress Headless CMS

This project is a headless WordPress implementation for saonamtg.com using Next.js for the frontend and WordPress as the API backend.

## Features

- Next.js 15.3.0 with TypeScript
- WordPress REST API integration
- WooCommerce integration for e-commerce
- Responsive design with Tailwind CSS
- Server-side rendering for SEO optimization
- Client-side caching for performance
- User authentication
- Shopping cart functionality
- Checkout process
- Error handling and logging

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- WordPress site with WooCommerce installed
- Required WordPress plugins:
  - ACF Pro
  - WP REST API Menus
  - Advanced Custom Fields to REST API
  - WooCommerce REST API
  - Yoast SEO REST API
  - WP REST Cache

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# WordPress API
WORDPRESS_API_URL=https://saonamtg.com/wp-json

# WooCommerce API
WC_API_BASE=https://saonamtg.com/wp-json/wc/v3
WC_KEY=your_woocommerce_consumer_key
WC_SECRET=your_woocommerce_consumer_secret

# Revalidation
REVALIDATE_TOKEN=your_revalidation_token
```

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

### Testing WooCommerce Integration

1. Browse products at `/san-pham`
2. View product details by clicking on a product
3. Add products to cart
4. View cart at `/gio-hang`
5. Proceed to checkout at `/thanh-toan`

### Testing User Authentication

1. Register a new account at `/dang-ky`
2. Login with your credentials at `/dang-nhap`
3. View your account at `/tai-khoan`
4. View your orders at `/tai-khoan/don-hang`

### Testing Caching

The application implements client-side caching for API responses to improve performance. To test:

1. Open the browser developer tools
2. Navigate to the Network tab
3. Browse products and notice subsequent requests being served from cache

### Testing Revalidation

To test the revalidation API:

```bash
curl -X GET "http://localhost:3000/api/revalidate?path=/san-pham&token=your_revalidation_token"
```

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: React components
- `src/context`: React context providers
- `src/lib`: Utility functions and API clients
- `public`: Static assets

## Performance Optimizations

- Client-side caching for API responses
- Image optimization with Next.js Image component
- Server-side rendering for critical pages
- Incremental Static Regeneration for content updates
- Error handling and monitoring

## Error Handling

The application includes comprehensive error handling:

- Client-side error logging to server
- Global error handler for unhandled exceptions
- Error boundaries for component-level errors
- Fallback UI for error states

## Next Steps

- Implement product search functionality
- Add product reviews and ratings
- Implement wishlist functionality
- Add product filtering by attributes
- Implement product comparison
- Add social sharing for products
- Implement analytics tracking
- Add multi-language support
