import React from "react";
import {
  CheckCircleIcon,
  HomeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const OrderSuccess: React.FC = () => {
  const router = useRouter();

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
  const estimatedDelivery = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewOrders = () => {
    router.push("/orders"); // Assuming you have an orders page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We've received your order and will
            process it soon.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold text-gray-900">
                  {orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold text-gray-900">
                  {estimatedDelivery}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation Email Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📧 A confirmation email has been sent to your email address with
              order details and tracking information.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>

            <button
              onClick={handleViewOrders}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              View My Orders
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Need help with your order?
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="/contact" className="text-blue-600 hover:text-blue-800">
                Contact Support
              </a>
              <span className="text-gray-300">|</span>
              <a href="/faq" className="text-blue-600 hover:text-blue-800">
                FAQ
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You can track your order status anytime from your account dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
