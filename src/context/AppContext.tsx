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

  const fetchProductData = async () => {
    // TODO: Replace with actual API call to fetch WooCommerce products
    // Example: const response = await fetch('/api/products');
    // const data = await response.json();
    // setProducts(data);
    setProducts([]);
  };

  const fetchUserData = async () => {
    // TODO: Replace with actual API call to fetch user data
    // Example: const response = await fetch('/api/user');
    // const data = await response.json();
    // setUserData(data);
    setUserData(false);
  };

  const addToCart = async (itemId: number, variationId?: number) => {
    let cartData = structuredClone(cartItems);
    const cartKey = variationId
      ? `${itemId}-${variationId}`
      : itemId.toString();

    if (cartData[cartKey]) {
      cartData[cartKey] += 1;
    } else {
      cartData[cartKey] = 1;
    }
    setCartItems(cartData);
  };

  const updateCartQuantity = async (
    itemId: number,
    quantity: number,
    variationId?: number
  ) => {
    let cartData = structuredClone(cartItems);
    const cartKey = variationId
      ? `${itemId}-${variationId}`
      : itemId.toString();

    if (quantity === 0) {
      delete cartData[cartKey];
    } else {
      cartData[cartKey] = quantity;
    }
    setCartItems(cartData);
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
