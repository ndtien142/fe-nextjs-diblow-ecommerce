# Cart Widget Documentation

This documentation covers the cart widget implementation for the Diblow e-commerce platform, integrated with WordPress headless and WooCommerce.

## Features

### ✅ Cart Widget (`CartWidget.tsx`)

- Slide-out cart panel from the right side
- Real-time cart updates
- Quantity controls (increase/decrease)
- Item removal
- Cart subtotal calculation
- Empty cart state
- Responsive design

### ✅ Cart Button (`CartButton.tsx`)

- Cart icon with item count badge
- Click to open cart widget
- Configurable size and text display
- Integrated with header components

### ✅ Full Cart Page (`/cart`)

- Detailed cart view with product images
- Quantity management
- Promo code application
- Order summary with tax calculation
- Responsive grid layout
- Continue shopping link
- Proceed to checkout button

### ✅ Context Integration

- Integrated with `AppContext`
- Persistent cart storage in localStorage
- WooCommerce API synchronization
- Product validation before adding to cart
- Stock quantity checks

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# WooCommerce REST API Configuration
NEXT_PUBLIC_WC_API_URL=https://your-wordpress-site.com/wp-json/wc/v3
NEXT_PUBLIC_WC_CONSUMER_KEY=ck_your_consumer_key_here
NEXT_PUBLIC_WC_CONSUMER_SECRET=cs_your_consumer_secret_here
NEXT_PUBLIC_CURRENCY=$
```

### 2. WooCommerce Setup

1. **Enable REST API:**

   - Go to WooCommerce > Settings > Advanced > REST API
   - Click "Add Key"
   - Set permissions to "Read/Write"
   - Copy the Consumer Key and Consumer Secret

2. **Required WooCommerce Plugins:**
   - WooCommerce (core)
   - WooCommerce REST API (if not included)

### 3. Cart Context Usage

The cart is managed through the `AppContext`. Here's how to use it in your components:

```tsx
import { useAppContext } from "@/context/AppContext";

const ProductComponent = () => {
  const { addToCart, cartItems, getCartCount, isCartLoading } = useAppContext();

  const handleAddToCart = async (productId: number, variationId?: number) => {
    await addToCart(productId, variationId);
  };

  return (
    <button onClick={() => handleAddToCart(123)} disabled={isCartLoading}>
      Add to Cart {isCartLoading && "(Adding...)"}
    </button>
  );
};
```

## Components

### CartWidget

Located: `/src/components/cart/CartWidget.tsx`

Props:

- `isOpen: boolean` - Controls widget visibility
- `onClose: () => void` - Function to close the widget

### CartButton

Located: `/src/components/cart/CartButton.tsx`

Props:

- `className?: string` - Additional CSS classes
- `showText?: boolean` - Show "Cart" text next to icon
- `iconSize?: "sm" | "md" | "lg"` - Icon size variant

### Cart Page

Located: `/src/app/cart/page.tsx`

Full-page cart experience with:

- Product grid layout
- Quantity controls
- Promo code input
- Order summary
- Checkout button

## API Integration

### Local Storage Fallback

The cart uses localStorage as a fallback when WooCommerce API is not available or fails:

- Cart data is saved to `diblow_cart` key
- Guest session ID is generated and stored
- Data persists across browser sessions

### WooCommerce Sync

When WooCommerce API is configured:

- Cart items are synchronized with WooCommerce
- Stock validation is performed
- Guest sessions are managed
- Cart data is kept in sync between local and remote

### Cart Utilities

Located: `/src/utils/cart.ts`

Key functions:

- `saveCartToStorage()` - Save cart to localStorage
- `loadCartFromStorage()` - Load cart from localStorage
- `WooCommerceCartAPI` - WooCommerce API wrapper
- `validateCartItem()` - Product/stock validation

## Styling

The cart components use Tailwind CSS with:

- Responsive design patterns
- Modern UI components
- Accessibility considerations
- Consistent color scheme
- Smooth animations and transitions

## Usage Examples

### Adding Cart to Header

```tsx
import CartButton from "@/components/cart/CartButton";

const Header = () => {
  return (
    <header>
      {/* Other header content */}
      <CartButton showText={false} iconSize="md" />
    </header>
  );
};
```

### Using Cart Widget

```tsx
import { useState } from "react";
import CartWidget from "@/components/cart/CartWidget";

const MyComponent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsCartOpen(true)}>Open Cart</button>
      <CartWidget isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
```

### Product Add to Cart

```tsx
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, isCartLoading } = useAppContext();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button
        onClick={() => addToCart(product.id)}
        disabled={isCartLoading || product.stock_status === "outofstock"}
      >
        {isCartLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
};
```

## Error Handling

The cart system includes comprehensive error handling:

- Network failures fallback to local storage
- Stock validation with user feedback
- Invalid product detection
- WooCommerce API error recovery

## Performance Considerations

- Cart data is cached in memory and localStorage
- Debounced API calls for quantity updates
- Lazy loading of cart components
- Optimistic UI updates with fallback

## Security

- Guest session management
- Input validation
- XSS protection in product data
- Secure API key handling

## Testing

To test the cart functionality:

1. Add products to cart
2. Update quantities
3. Remove items
4. Apply promo codes
5. Test with and without WooCommerce API
6. Verify localStorage persistence
7. Test responsive design on mobile

## Future Enhancements

Potential improvements:

- [ ] Wishlist integration
- [ ] Recently viewed products
- [ ] Cart abandonment recovery
- [ ] Social sharing for cart
- [ ] Multiple currency support
- [ ] Advanced promo code system
- [ ] Inventory alerts
- [ ] Cart analytics
