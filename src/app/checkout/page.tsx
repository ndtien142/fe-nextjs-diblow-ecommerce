"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/header";
import { useAppContext } from "@/context/AppContext";
import CheckoutProgress from "./components/CheckoutProgress";
import CartStep from "./components/CartStep";
import BillingStep from "./components/BillingStep";
import PaymentStep from "./components/PaymentStep";
import OrderSuccess from "./components/OrderSuccess";
import { CartItem } from "@/types/product.interface";

export interface CheckoutData {
  cartItems: any[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  billingAddress: any;
  shippingAddress: any;
  shippingMethod: any;
  paymentMethod: any;
}

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const { cartItems, products, getCartAmount, router } = useAppContext();

  // Convert cart items to checkout format
  const getCartItemsForCheckout = () => {
    const checkoutItems = [];

    for (const cartKey in cartItems) {
      if (cartItems[cartKey] > 0) {
        // Parse the cart key to get product ID and variation ID
        const [productIdStr, variationIdStr] = cartKey.split("-");
        const productId = parseInt(productIdStr);
        const variationId = variationIdStr ? parseInt(variationIdStr) : null;

        // Find the product
        const product = products.find((p) => p.id === productId);
        if (!product) continue;

        // Get variation data if available
        let variation = null;
        let variantText = "";
        let image =
          product.images && product.images.length > 0
            ? product.images[0].src
            : "/placeholder-image.jpg";
        let price = parseFloat(product.price) || 0;

        if (variationId && (window as any).productVariations) {
          variation = (window as any).productVariations.find(
            (v: any) => v.id === variationId
          );
          if (variation) {
            // Use variation's price and image if available
            price = parseFloat(variation.price) || price;
            if (variation.image?.src) {
              image = variation.image.src;
            }

            // Build variant text from attributes
            if (variation.attributes && variation.attributes.length > 0) {
              variantText = variation.attributes
                .map((attr: any) => `${attr.name}: ${attr.option}`)
                .join(", ");
            } else if (variation.name) {
              variantText = variation.name;
            }
          }
        }

        checkoutItems.push({
          id: productId,
          cartKey,
          name: product.name,
          price: price,
          quantity: cartItems[cartKey],
          image: image,
          variant: variantText,
          product: product,
          variationId: variationId,
          variation: variation,
        });
      }
    }

    return checkoutItems;
  };

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    cartItems: [],
    subtotal: 0,
    discount: 50,
    tax: 124.7,
    total: 1371.7,
    billingAddress: null,
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
  });

  const steps = [
    { number: 1, title: "Cart", description: "Review your items" },
    { number: 2, title: "Billing", description: "Shipping & billing address" },
    { number: 3, title: "Payment", description: "Shipping & payment method" },
  ];

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const updateCheckoutData = (newData: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...newData }));
  };

  // Update checkout data when cart items or products change
  useEffect(() => {
    if (products.length > 0) {
      const cartItemsForCheckout = getCartItemsForCheckout();
      const subtotal = getCartAmount();
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal - checkoutData.discount + tax;

      setCheckoutData((prev) => ({
        ...prev,
        cartItems: cartItemsForCheckout,
        subtotal: subtotal,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
      }));
    }
  }, [cartItems, products, checkoutData.discount]);

  // Redirect to cart if no items
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length === 0) {
      router.push("/cart");
    }
  }, [cartItems, products, router]);

  const handleCompleteOrder = async () => {
    try {
      // Here you would make an API call to process the order
      console.log("Processing order...", checkoutData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear the cart after successful order
      // clearCart(); // Uncomment this when ready to clear cart after order

      setIsOrderComplete(true);
    } catch (error) {
      console.error("Order processing failed:", error);
      // Handle error
    }
  };

  if (isOrderComplete) {
    return (
      <>
        <Navbar />
        <div className="main-productPage min-h-screen">
          <OrderSuccess />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="main-productPage min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {/* Progress Steps */}
            <CheckoutProgress
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />

            {/* Step Content */}
            <div className="mt-8">
              {currentStep === 1 && (
                <CartStep
                  checkoutData={checkoutData}
                  onNext={handleNextStep}
                  onUpdateData={updateCheckoutData}
                />
              )}

              {currentStep === 2 && (
                <BillingStep
                  checkoutData={checkoutData}
                  onNext={handleNextStep}
                  onPrevious={handlePreviousStep}
                  onUpdateData={updateCheckoutData}
                />
              )}

              {currentStep === 3 && (
                <PaymentStep
                  checkoutData={checkoutData}
                  onPrevious={handlePreviousStep}
                  onComplete={handleCompleteOrder}
                  onUpdateData={updateCheckoutData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
