import { CartItem, Product } from "@/types/product.interface";

// WooCommerce API base URL - should be set in your environment variables
const WC_API_BASE = process.env.NEXT_PUBLIC_WC_API_URL || "";
const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "";
const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "";

// Cart storage keys
const CART_STORAGE_KEY = "diblow_cart";
const CART_CACHE_STORAGE_KEY = "diblow_cart_cache";
const GUEST_SESSION_KEY = "diblow_guest_session";

// Generate guest session ID
export const generateGuestSession = (): string => {
  const sessionId = `guest_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  return sessionId;
};

// Get guest session ID
export const getGuestSession = (): string => {
  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionId) {
    sessionId = generateGuestSession();
  }
  return sessionId;
};

// Save cart to localStorage (for guest users) or sync with WooCommerce
export const saveCartToStorage = (cartItems: Record<string, number>): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// Load cart from localStorage
export const loadCartFromStorage = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return {};
  }
};

// Save cart product cache to localStorage
export const saveCartCacheToStorage = (
  cartCache: Record<string, any>
): void => {
  try {
    localStorage.setItem(CART_CACHE_STORAGE_KEY, JSON.stringify(cartCache));
  } catch (error) {
    console.error("Failed to save cart cache to localStorage:", error);
  }
};

// Load cart product cache from localStorage
export const loadCartCacheFromStorage = (): Record<string, any> => {
  try {
    const stored = localStorage.getItem(CART_CACHE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load cart cache from localStorage:", error);
    return {};
  }
};

// Clear cart cache from storage
export const clearCartCacheStorage = (): void => {
  try {
    localStorage.removeItem(CART_CACHE_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cart cache from localStorage:", error);
  }
};

// Clear cart from storage
export const clearCartStorage = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_CACHE_STORAGE_KEY); // Also clear cache
  } catch (error) {
    console.error("Failed to clear cart from localStorage:", error);
  }
};

// WooCommerce Cart API functions
export class WooCommerceCartAPI {
  private static baseHeaders = {
    "Content-Type": "application/json",
  };

  // Add item to WooCommerce cart
  static async addToCart(
    productId: number,
    quantity: number = 1,
    variationId?: number,
    customerId?: number
  ): Promise<any> {
    try {
      const cartData = {
        product_id: productId,
        quantity: quantity,
        variation_id: variationId,
        customer_id: customerId || 0,
        session_id: getGuestSession(),
      };

      const response = await fetch(`${WC_API_BASE}/cart/add-item`, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(cartData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to add item to WooCommerce cart:", error);
      throw error;
    }
  }

  // Update cart item quantity
  static async updateCartItem(
    cartItemKey: string,
    quantity: number,
    customerId?: number
  ): Promise<any> {
    try {
      const updateData = {
        key: cartItemKey,
        quantity: quantity,
        customer_id: customerId || 0,
        session_id: getGuestSession(),
      };

      const response = await fetch(`${WC_API_BASE}/cart/update-item`, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeFromCart(
    cartItemKey: string,
    customerId?: number
  ): Promise<any> {
    try {
      const removeData = {
        key: cartItemKey,
        customer_id: customerId || 0,
        session_id: getGuestSession(),
      };

      const response = await fetch(`${WC_API_BASE}/cart/remove-item`, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(removeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  }

  // Get cart contents
  static async getCart(customerId?: number): Promise<any> {
    try {
      const params = new URLSearchParams({
        customer_id: (customerId || 0).toString(),
        session_id: getGuestSession(),
      });

      const response = await fetch(`${WC_API_BASE}/cart?${params}`, {
        method: "GET",
        headers: this.baseHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get cart:", error);
      throw error;
    }
  }

  // Clear cart
  static async clearCart(customerId?: number): Promise<any> {
    try {
      const clearData = {
        customer_id: customerId || 0,
        session_id: getGuestSession(),
      };

      const response = await fetch(`${WC_API_BASE}/cart/clear`, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(clearData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  }

  // Apply coupon
  static async applyCoupon(
    couponCode: string,
    customerId?: number
  ): Promise<any> {
    try {
      const couponData = {
        code: couponCode,
        customer_id: customerId || 0,
        session_id: getGuestSession(),
      };

      const response = await fetch(`${WC_API_BASE}/cart/apply-coupon`, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      throw error;
    }
  }

  // Remove coupon
  static async removeCoupon(
    couponCode: string,
    customerId?: number
  ): Promise<any> {
    try {
      const couponData = {
        code: couponCode,
        customer_id: customerId || 0,
        session_id: getGuestSession(),
      };

      const response = await fetch(`${WC_API_BASE}/cart/remove-coupon`, {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to remove coupon:", error);
      throw error;
    }
  }
}

// Helper function to convert WooCommerce cart items to our CartItem interface
export const convertWooCommerceCartItems = (wcCartItems: any[]): CartItem[] => {
  return wcCartItems.map((item) => ({
    id: parseInt(item.key.replace(/\D/g, "")), // Extract numeric ID from key
    product_id: item.product_id,
    variation_id: item.variation_id || undefined,
    name: item.product_name,
    price: item.product_price.toString(),
    quantity: item.quantity,
    image: {
      id: 0,
      src: item.product_image || "/placeholder-image.jpg",
      alt: item.product_name,
    } as any,
    attributes: item.variation
      ? Object.entries(item.variation).map(([key, value]) => ({
          id: 0,
          name: key,
          slug: key.toLowerCase(),
          option: value as string,
        }))
      : undefined,
    total: item.line_total.toString(),
  }));
};

// Calculate cart totals
export const calculateCartTotals = (cartItems: CartItem[]) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.1; // 10% tax rate - adjust as needed

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat((subtotal + tax).toFixed(2)),
  };
};

// Validate cart item before adding
export const validateCartItem = (
  product: Product,
  quantity: number,
  variationId?: number
): { isValid: boolean; error?: string } => {
  // Check if product exists
  if (!product) {
    return { isValid: false, error: "Product not found" };
  }

  // Check stock status
  if (product.stock_status === "outofstock") {
    return { isValid: false, error: "Product is out of stock" };
  }

  // Check quantity
  if (quantity <= 0) {
    return { isValid: false, error: "Quantity must be greater than 0" };
  }

  // Check stock quantity if managed
  if (product.manage_stock && product.stock_quantity !== null) {
    if (quantity > product.stock_quantity) {
      return {
        isValid: false,
        error: `Only ${product.stock_quantity} items available in stock`,
      };
    }
  }

  // Check if variation is required but not provided
  if (product.type === "variable" && !variationId) {
    return { isValid: false, error: "Please select product options" };
  }

  return { isValid: true };
};

// Utility function to fetch missing product data for cart items
export const fetchMissingProductData = async (
  cartItems: Record<string, number>,
  cartCache: Record<string, any>
): Promise<Record<string, any>> => {
  const missingCartKeys: string[] = [];
  const updatedCache = { ...cartCache };

  // Identify cart items without cached product data
  for (const cartKey in cartItems) {
    if (cartItems[cartKey] > 0 && !cartCache[cartKey]?.product) {
      missingCartKeys.push(cartKey);
    }
  }

  if (missingCartKeys.length === 0) {
    return updatedCache;
  }

  // Fetch missing product data
  for (const cartKey of missingCartKeys) {
    try {
      const [productId, variationId] = cartKey.split("-");

      // Fetch product data from API
      const productResponse = await fetch(`/api/products/${productId}`);
      if (!productResponse.ok) continue;

      const productData = await productResponse.json();

      let variationData = null;
      if (variationId) {
        // Fetch variation data if needed
        const variationResponse = await fetch(
          `/api/products/${productId}/variations/${variationId}`
        );
        if (variationResponse.ok) {
          variationData = await variationResponse.json();
        }
      }

      // Cache the fetched data
      updatedCache[cartKey] = {
        product: productData,
        variation: variationData,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(
        `Failed to fetch product data for cart key ${cartKey}:`,
        error
      );
    }
  }

  return updatedCache;
};
