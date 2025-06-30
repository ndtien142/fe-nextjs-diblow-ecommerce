# WooCommerce Popular Products Integration Guide

## Overview

Your Next.js application now has full integration with WooCommerce to fetch and display popular, trending, and bestselling products. Here's what's been implemented:

## 🚀 Features Implemented

### 1. **API Routes** (`/src/app/api/products/`)

- **`/api/products/popular`** - Fetches products ordered by popularity (total sales)
- **`/api/products/trending`** - Smart algorithm combining featured, popular, and top-rated products
- **`/api/products/bestsellers`** - Products ranked by sales volume with bestseller marking

### 2. **TypeScript Interfaces** (`/src/types/product.interface.ts`)

- Complete WooCommerce product interface with all fields
- Added `popularity_score`, `sales_rank`, `is_bestseller` fields
- Comprehensive type safety for all product operations

### 3. **React Hooks** (`/src/hooks/`)

- **`useProducts`** - Flexible hook for any product fetching strategy
- **`usePopularProducts`** - Specific hook for popular products
- **`useTrendingProducts`** - Specific hook for trending products
- **`useBestsellerProducts`** - Specific hook for bestseller products

### 4. **Components**

- **`PopularProducts`** - Displays popular products with loading/error states
- **`ProductSection`** - Generic component for any product type
- **`PopularProductsDemo`** - Interactive demo with tabs and debugging
- **`ProductCard`** - Enhanced with better image handling and error states

## 🔧 Configuration

### Next.js Image Configuration (`next.config.ts`)

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "ndtien142.xyz",
      pathname: "/wp-content/uploads/**",
    },
  ];
}
```

### Environment Variables (`.env.local`)

```
WOOCOMMERCE_BASE_URL=https://ndtien142.xyz
WOOCOMMERCE_CUSTOMER_KEY=your_key
WOOCOMMERCE_CUSTOMER_SECRET=your_secret
```

## 📊 How Popular Products Work

### Popular Products Strategy

- **Endpoint**: `/api/products/popular`
- **Method**: Uses WooCommerce `orderby=popularity` parameter
- **Sorting**: Based on `total_sales` field
- **Best for**: Simple popularity based on sales volume

### Trending Products Strategy

- **Endpoint**: `/api/products/trending`
- **Method**: Smart algorithm combining multiple factors:
  - Featured products (+10 bonus points)
  - Total sales (×0.1 multiplier)
  - Rating × rating count (×0.2 multiplier)
  - Recent products (+5 bonus for <30 days old)
- **Best for**: Dynamic trending based on multiple engagement factors

### Bestsellers Strategy

- **Endpoint**: `/api/products/bestsellers`
- **Method**: Ranks products by sales volume
- **Features**: Adds `sales_rank` and `is_bestseller` fields
- **Best for**: Clear bestseller identification

## 🎯 Usage Examples

### Basic Usage

```tsx
import { usePopularProducts } from "@/hooks/useProducts";

const MyComponent = () => {
  const { products, loading, error } = usePopularProducts(8);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Advanced Usage with Options

```tsx
import { useProducts } from "@/hooks/useProducts";

const { products, loading, error, refetch } = useProducts({
  strategy: "trending",
  per_page: 12,
  featured: true,
  on_sale: false,
});
```

## 📱 Components Usage

### PopularProducts Component

```tsx
<PopularProducts
  title="🔥 Trending Products"
  count={8}
  strategy="trending"
  className="my-16"
/>
```

### ProductSection Component

```tsx
<ProductSection
  title="Best Sellers"
  type="bestsellers"
  count={6}
  className="mb-12"
/>
```

## 🛠️ API Parameters

All endpoints support these query parameters:

- `per_page` - Number of products to return (default: 10)
- `page` - Page number for pagination
- `category` - Filter by category slug
- `search` - Search term
- `featured` - Filter featured products (true/false)
- `on_sale` - Filter sale products (true/false)

## 🔍 Debugging

### Console Logging

- All API calls are logged with request details
- Product fetching includes success/error logging
- Image loading errors are tracked

### Debug Component

Use `PopularProductsDemo` component for interactive testing:

```tsx
import PopularProductsDemo from "@/components/PopularProductsDemo";

// In your page
<PopularProductsDemo />;
```

## 🎨 Styling

All components use Tailwind CSS with:

- Responsive design (mobile-first)
- FuturaSTD font family
- Loading skeletons
- Error states with retry buttons
- Smooth transitions and hover effects

## 🚨 Error Handling

### Image Loading

- Automatic fallback to placeholder images
- Proper error handling for external images
- Blur placeholder during loading

### API Errors

- Comprehensive error messages
- Retry functionality
- Graceful degradation

## 📈 Performance

### Caching Strategy

- Popular products: No cache (for real-time data)
- Trending products: 30-minute cache
- Bestsellers: 1-hour cache

### Image Optimization

- Next.js Image component with optimization
- Proper sizing and lazy loading
- WebP conversion when supported

## 🔄 Current Status

✅ **Working Features:**

- All API endpoints functional
- Product fetching and display
- Error handling and loading states
- Image configuration for WooCommerce

⚠️ **Fixed Issues:**

- Next.js image configuration for external domains
- Product interface type safety
- Error handling for failed API calls

## 🎯 Next Steps

1. **Optional Improvements:**

   - Add infinite scroll for product lists
   - Implement product search and filtering
   - Add cart functionality
   - Create product detail pages

2. **Performance Optimization:**

   - Convert OTF fonts to WOFF2
   - Implement image lazy loading
   - Add service worker for offline support

3. **Analytics:**
   - Track popular product views
   - Monitor API performance
   - User engagement metrics

Your WooCommerce popular products integration is now fully functional and ready for production use! 🎉
