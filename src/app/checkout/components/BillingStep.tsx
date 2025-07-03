import React, { useState } from "react";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CheckoutData } from "../page";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

interface BillingStepProps {
  checkoutData: CheckoutData;
  onNext: () => void;
  onPrevious: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

const BillingStep: React.FC<BillingStepProps> = ({
  checkoutData,
  onNext,
  onPrevious,
  onUpdateData,
}) => {
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<
    string | null
  >(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    string | null
  >(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });

  // Mock addresses - replace with actual user addresses
  const savedAddresses: Address[] = [
    {
      id: "1",
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: "2",
      name: "John Doe",
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
  ];

  const handleAddressSelect = (
    addressId: string,
    type: "billing" | "shipping"
  ) => {
    const address = savedAddresses.find((addr) => addr.id === addressId);
    if (!address) return;

    if (type === "billing") {
      setSelectedBillingAddress(addressId);
      onUpdateData({ billingAddress: address });
    } else {
      setSelectedShippingAddress(addressId);
      onUpdateData({ shippingAddress: address });
    }
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked && selectedShippingAddress) {
      setSelectedBillingAddress(selectedShippingAddress);
      onUpdateData({ billingAddress: checkoutData.shippingAddress });
    }
  };

  const handleAddNewAddress = () => {
    const address: Address = {
      id: `new-${Date.now()}`,
      ...newAddress,
    };

    // Add to saved addresses (in real app, this would be an API call)
    // For now, just select it
    setSelectedShippingAddress(address.id);
    onUpdateData({ shippingAddress: address });
    setShowAddressForm(false);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
    });
  };

  const canProceed =
    selectedShippingAddress && (sameAsShipping || selectedBillingAddress);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Billing & Shipping Address
        </h2>

        {/* Shipping Address */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Shipping Address
          </h3>

          <div className="grid gap-4">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedShippingAddress === address.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleAddressSelect(address.id, "shipping")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {address.name}
                      </h4>
                      {address.isDefault && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">
                      {address.street}
                      <br />
                      {address.city}, {address.state} {address.zipCode}
                      <br />
                      {address.country}
                      <br />
                      {address.phone}
                    </p>
                  </div>

                  {selectedShippingAddress === address.id && (
                    <CheckIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            ))}

            {/* Add New Address */}
            <div
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors duration-200"
              onClick={() => setShowAddressForm(true)}
            >
              <div className="flex items-center justify-center text-gray-500">
                <PlusIcon className="w-6 h-6 mr-2" />
                <span>Add New Address</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Address Form */}
        {showAddressForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Add New Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={newAddress.zipCode}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      zipCode: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAddNewAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Address
              </button>
              <button
                onClick={() => setShowAddressForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Billing Address */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Billing Address
          </h3>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-gray-700">Same as shipping address</span>
            </label>
          </div>

          {!sameAsShipping && (
            <div className="grid gap-4">
              {savedAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedBillingAddress === address.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleAddressSelect(address.id, "billing")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {address.name}
                        </h4>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                        <br />
                        {address.phone}
                      </p>
                    </div>

                    {selectedBillingAddress === address.id && (
                      <CheckIcon className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex space-x-3">
          <button
            onClick={onPrevious}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Back to Cart
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingStep;
