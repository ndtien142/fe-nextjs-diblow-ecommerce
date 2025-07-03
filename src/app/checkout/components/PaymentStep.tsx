import React, { useState } from "react";
import {
  CheckIcon,
  CreditCardIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { CheckoutData } from "../page";

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface PaymentStepProps {
  checkoutData: CheckoutData;
  onPrevious: () => void;
  onComplete: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  checkoutData,
  onPrevious,
  onComplete,
  onUpdateData,
}) => {
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: 9.99,
      estimatedDays: "5-7 days",
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "2-3 business days",
      price: 19.99,
      estimatedDays: "2-3 days",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next business day",
      price: 29.99,
      estimatedDays: "1 day",
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: "💳",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: "🅿️",
    },
    {
      id: "apple",
      name: "Apple Pay",
      description: "Pay with Touch ID or Face ID",
      icon: "🍎",
    },
  ];

  const handleShippingSelect = (shippingId: string) => {
    const shipping = shippingMethods.find((method) => method.id === shippingId);
    if (!shipping) return;

    setSelectedShipping(shippingId);

    // Update total with shipping cost
    const newTotal =
      checkoutData.subtotal -
      checkoutData.discount +
      checkoutData.tax +
      shipping.price;

    onUpdateData({
      shippingMethod: shipping,
      total: newTotal,
    });
  };

  const handlePaymentSelect = (paymentId: string) => {
    const payment = paymentMethods.find((method) => method.id === paymentId);
    if (!payment) return;

    setSelectedPayment(paymentId);
    onUpdateData({ paymentMethod: payment });
  };

  const handleCompleteOrder = async () => {
    if (!selectedShipping || !selectedPayment) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onComplete();
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
    }
  };

  const canComplete =
    selectedShipping &&
    selectedPayment &&
    (selectedPayment !== "card" || cardDetails.number);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Shipping & Payment
        </h2>

        {/* Shipping Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <TruckIcon className="w-5 h-5 inline mr-2" />
            Shipping Method
          </h3>

          <div className="space-y-3">
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedShipping === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleShippingSelect(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {method.name}
                      </h4>
                      <span className="font-semibold text-gray-900">
                        ${method.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {method.description}
                    </p>
                  </div>

                  {selectedShipping === method.id && (
                    <CheckIcon className="w-6 h-6 text-blue-600 ml-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <CreditCardIcon className="w-5 h-5 inline mr-2" />
            Payment Method
          </h3>

          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedPayment === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePaymentSelect(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {method.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  {selectedPayment === method.id && (
                    <CheckIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Card Details Form */}
          {selectedPayment === "card" && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Card Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        number: e.target.value,
                      }))
                    }
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        expiry: e.target.value,
                      }))
                    }
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        cvv: e.target.value,
                      }))
                    }
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Final Order Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ${checkoutData.subtotal.toFixed(2)}
              </span>
            </div>

            {checkoutData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${checkoutData.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">
                ${checkoutData.tax.toFixed(2)}
              </span>
            </div>

            {checkoutData.shippingMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Shipping ({checkoutData.shippingMethod.name})
                </span>
                <span className="font-medium">
                  ${checkoutData.shippingMethod.price.toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${checkoutData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex space-x-3">
          <button
            onClick={onPrevious}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
          >
            Back to Billing
          </button>
          <button
            onClick={handleCompleteOrder}
            disabled={!canComplete || isProcessing}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Complete Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
