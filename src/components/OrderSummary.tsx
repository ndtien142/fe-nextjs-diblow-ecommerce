import { useAppContext } from "@/context/AppContext";
import { Address } from "@/types/product.interface";
import React, { useEffect, useState } from "react";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  const fetchUserAddresses = async () => {
    // TODO: Replace with actual WooCommerce API call to fetch user addresses
    // Example: const response = await fetch('/api/user/addresses');
    // const addresses = await response.json();
    // setUserAddresses(addresses);

    // Temporary placeholder addresses for development
    const placeholderAddresses: Address[] = [
      {
        id: 1,
        userId: 1,
        fullName: "John Doe",
        phoneNumber: "+1234567890",
        pincode: "12345",
        area: "Downtown",
        city: "New York",
        state: "NY",
      },
      {
        id: 2,
        userId: 1,
        fullName: "Jane Smith",
        phoneNumber: "+0987654321",
        pincode: "54321",
        area: "Uptown",
        city: "Los Angeles",
        state: "CA",
      },
    ];
    setUserAddresses(placeholderAddresses);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    // TODO: Replace with actual WooCommerce API call to create order
    // Example:
    // const orderData = {
    //   payment_method: "cod", // cash on delivery
    //   payment_method_title: "Cash on delivery",
    //   set_paid: false,
    //   billing: {
    //     first_name: selectedAddress.fullName.split(' ')[0],
    //     last_name: selectedAddress.fullName.split(' ')[1] || '',
    //     address_1: selectedAddress.area,
    //     city: selectedAddress.city,
    //     state: selectedAddress.state,
    //     postcode: selectedAddress.pincode,
    //     phone: selectedAddress.phoneNumber
    //   },
    //   shipping: {
    //     first_name: selectedAddress.fullName.split(' ')[0],
    //     last_name: selectedAddress.fullName.split(' ')[1] || '',
    //     address_1: selectedAddress.area,
    //     city: selectedAddress.city,
    //     state: selectedAddress.state,
    //     postcode: selectedAddress.pincode
    //   },
    //   line_items: cartItems // need to format cart items for WooCommerce
    // };
    //
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });

    console.log("Creating order with address:", selectedAddress);
    alert("Order functionality will be implemented with WooCommerce API");
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount()}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {getCartAmount() + Math.floor(getCartAmount() * 0.02)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
