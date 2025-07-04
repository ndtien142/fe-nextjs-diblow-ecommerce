"use client";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AppContextType, Product, User } from "@/types/product.interface";
import {
  saveCartToStorage,
  loadCartFromStorage,
  clearCartStorage,
  saveCartCacheToStorage,
  loadCartCacheFromStorage,
  fetchMissingProductData,
  WooCommerceCartAPI,
  validateCartItem,
} from "@/utils/cart";

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartProductsCache, setCartProductsCache] = useState<
    Record<string, any>
  >({}); // Cache for cart product data
  const [userData, setUserData] = useState<User | false>(false);
  const [isSeller, setIsSeller] = useState<boolean>(true);
  const [isCartLoading, setIsCartLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    const savedCache = loadCartCacheFromStorage();
    setCartItems(savedCart);
    setCartProductsCache(savedCache);
  }, []);

  const fetchUserData = async () => {
    // TODO: Replace with actual API call to fetch user data
    // Example: const response = await fetch('/api/user');
    // const data = await response.json();
    // setUserData(data);
    setUserData(false);
  };

  const addToCart = async (
    itemId: number,
    variationId?: number,
    productData?: Product,
    variationData?: any
  ) => {
    try {
      setIsCartLoading(true);

      // Use provided product data or try to find in cache
      let product = productData;
      if (!product) {
        const cartKey = variationId
          ? `${itemId}-${variationId}`
          : itemId.toString();
        product = cartProductsCache[cartKey]?.product;
      }

      if (!product) {
        console.error(
          "Product data not available. Please provide product data when adding to cart."
        );
        alert("Product data not available. Please try again.");
        return;
      }

      // Cache the product and variation data for future use
      const cartKey = variationId
        ? `${itemId}-${variationId}`
        : itemId.toString();
      const newCacheData = {
        ...cartProductsCache,
        [cartKey]: {
          product: product,
          variation: variationData,
          timestamp: Date.now(),
        },
      };
      setCartProductsCache(newCacheData);

      // Save cache to localStorage
      saveCartCacheToStorage(newCacheData);

      // Validate cart item
      const validation = validateCartItem(product, 1, variationId);
      if (!validation.isValid) {
        console.error("Validation failed:", validation.error);
        alert(validation.error);
        return;
      }

      let cartData = structuredClone(cartItems);

      if (cartData[cartKey]) {
        cartData[cartKey] += 1;
      } else {
        cartData[cartKey] = 1;
      }

      // Update local state
      setCartItems(cartData);

      // Save to localStorage
      saveCartToStorage(cartData);

      // Sync with WooCommerce if API is available
      if (process.env.NEXT_PUBLIC_WC_API_URL) {
        try {
          await WooCommerceCartAPI.addToCart(
            itemId,
            1,
            variationId,
            userData ? userData.id : undefined
          );
        } catch (error) {
          console.error("Failed to sync with WooCommerce:", error);
          // Continue with local cart functionality
        }
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateCartQuantity = async (
    itemId: number,
    quantity: number,
    variationId?: number
  ) => {
    try {
      setIsCartLoading(true);

      let cartData = structuredClone(cartItems);
      const cartKey = variationId
        ? `${itemId}-${variationId}`
        : itemId.toString();

      if (quantity === 0) {
        delete cartData[cartKey];
        // Also remove from cache if no longer in cart
        const newCacheData = { ...cartProductsCache };
        delete newCacheData[cartKey];
        setCartProductsCache(newCacheData);
        saveCartCacheToStorage(newCacheData);
      } else {
        // Validate quantity if increasing and we have product data
        if (quantity > (cartItems[cartKey] || 0)) {
          const cachedProduct = cartProductsCache[cartKey]?.product;
          if (cachedProduct) {
            const validation = validateCartItem(
              cachedProduct,
              quantity,
              variationId
            );
            if (!validation.isValid) {
              console.error("Validation failed:", validation.error);
              alert(validation.error);
              return;
            }
          }
        }
        cartData[cartKey] = quantity;
      }

      // Update local state
      setCartItems(cartData);

      // Save to localStorage
      saveCartToStorage(cartData);

      // Sync with WooCommerce if API is available
      if (process.env.NEXT_PUBLIC_WC_API_URL) {
        try {
          if (quantity === 0) {
            await WooCommerceCartAPI.removeFromCart(
              cartKey,
              userData ? userData.id : undefined
            );
          } else {
            await WooCommerceCartAPI.updateCartItem(
              cartKey,
              quantity,
              userData ? userData.id : undefined
            );
          }
        } catch (error) {
          console.error("Failed to sync with WooCommerce:", error);
          // Continue with local cart functionality
        }
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        // Get product and variation data from cache
        const cachedData = cartProductsCache[items];
        if (cachedData?.product) {
          let price = parseFloat(cachedData.product.price) || 0;

          // If this is a variation, use the variation price
          if (cachedData.variation?.price) {
            price = parseFloat(cachedData.variation.price) || price;
          }

          totalAmount += price * cartItems[items];
        }
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const clearCart = async () => {
    try {
      setIsCartLoading(true);

      // Clear local state
      setCartItems({});
      setCartProductsCache({});

      // Clear localStorage
      clearCartStorage();

      // Clear WooCommerce cart if API is available
      if (process.env.NEXT_PUBLIC_WC_API_URL) {
        try {
          await WooCommerceCartAPI.clearCart(
            userData ? userData.id : undefined
          );
        } catch (error) {
          console.error("Failed to clear WooCommerce cart:", error);
        }
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const refreshCartProductData = async () => {
    try {
      setIsCartLoading(true);

      const updatedCache = await fetchMissingProductData(
        cartItems,
        cartProductsCache
      );

      if (
        Object.keys(updatedCache).length !==
        Object.keys(cartProductsCache).length
      ) {
        setCartProductsCache(updatedCache);
        saveCartCacheToStorage(updatedCache);
        console.log("Cart product data refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to refresh cart product data:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Auto-refresh missing product data on mount
  useEffect(() => {
    const hasCartItems = Object.keys(cartItems).length > 0;
    const hasMissingData = Object.keys(cartItems).some(
      (cartKey) =>
        cartItems[cartKey] > 0 && !cartProductsCache[cartKey]?.product
    );

    if (hasCartItems && hasMissingData) {
      console.log("Detected missing product data, refreshing...");
      refreshCartProductData();
    }
  }, [cartItems, cartProductsCache]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const value: AppContextType = {
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    clearCart,
    refreshCartProductData,
    isCartLoading,
  };

  // Expose cartProductsCache globally for cart components
  if (typeof window !== "undefined") {
    (window as any).cartProductsCache = cartProductsCache;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
