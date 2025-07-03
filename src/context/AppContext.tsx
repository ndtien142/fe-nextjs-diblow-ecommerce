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

  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<User | false>(false);
  const [isSeller, setIsSeller] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [isCartLoading, setIsCartLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    setCartItems(savedCart);
  }, []);

  const fetchProductData = async () => {
    // TODO: Replace with actual API call to fetch WooCommerce products
    // For now, using static product data from assets
    try {
      // Import the static product data
      const { products: staticProducts, productVariations } = await import(
        "@/assets/productData"
      );
      setProducts(staticProducts);
      // Store variations for later use
      (window as any).productVariations = productVariations;
    } catch (error) {
      console.error("Failed to load product data:", error);
      setProducts([]);
    }
  };

  const fetchUserData = async () => {
    // TODO: Replace with actual API call to fetch user data
    // Example: const response = await fetch('/api/user');
    // const data = await response.json();
    // setUserData(data);
    setUserData(false);
  };

  const addToCart = async (itemId: number, variationId?: number) => {
    try {
      setIsCartLoading(true);

      // Find the product
      const product = products.find((p) => p.id === itemId);
      if (!product) {
        console.error("Product not found");
        return;
      }

      // Validate cart item
      const validation = validateCartItem(product, 1, variationId);
      if (!validation.isValid) {
        console.error("Validation failed:", validation.error);
        alert(validation.error);
        return;
      }

      let cartData = structuredClone(cartItems);
      const cartKey = variationId
        ? `${itemId}-${variationId}`
        : itemId.toString();

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
      } else {
        // Validate quantity if increasing
        if (quantity > (cartItems[cartKey] || 0)) {
          const product = products.find((p) => p.id === itemId);
          if (product) {
            const validation = validateCartItem(product, quantity, variationId);
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
      // Parse the cart key to get product ID and variation ID
      const [productId, variationId] = items.split("-");
      let itemInfo = products.find(
        (product) => product.id === parseInt(productId)
      );

      if (itemInfo && cartItems[items] > 0) {
        // Use the product price (convert string to number)
        const price = parseFloat(itemInfo.price) || 0;
        totalAmount += price * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const clearCart = async () => {
    try {
      setIsCartLoading(true);

      // Clear local state
      setCartItems({});

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

  useEffect(() => {
    fetchProductData();
  }, []);

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
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    clearCart,
    isCartLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
