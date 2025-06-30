import React, { useState } from "react";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useProducts } from "@/hooks/useProducts";

const VariableProductDemo: React.FC = () => {
  const [productId, setProductId] = useState<string>("");

  // Get list of products to select from
  const { products } = useProducts({ strategy: "all", per_page: 20 });

  // Fetch product details
  const { product, variations, loading, error, refetch } = useProductDetail(
    productId,
    {
      autoFetch: false,
      fetchVariations: true,
    }
  );

  // Find variable products from the list
  const variableProducts = products.filter((p) => p.type === "variable");

  const handleFetchProduct = () => {
    if (productId) {
      refetch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Variable Product & Attribute Selection Demo
      </h2>

      {/* Product Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">
          Select Variable Product to Test
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Product ID:
            </label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="e.g., 123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or select a variable product:
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a variable product...</option>
              {variableProducts.map((product) => (
                <option key={product.id} value={product.id.toString()}>
                  {product.name} (ID: {product.id}) -{" "}
                  {product.variations.length} variations
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleFetchProduct}
          disabled={!productId || loading}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Fetching..." : "Load Product & Variations"}
        </button>
      </div>

      {/* Product Type Info */}
      {products.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            Product Type Summary:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Total Products:</strong> {products.length}
            </div>
            <div>
              <strong>Simple Products:</strong>{" "}
              {products.filter((p) => p.type === "simple").length}
            </div>
            <div>
              <strong>Variable Products:</strong>{" "}
              {products.filter((p) => p.type === "variable").length}
            </div>
            <div>
              <strong>Other Types:</strong>{" "}
              {
                products.filter((p) => !["simple", "variable"].includes(p.type))
                  .length
              }
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            Loading product and variations...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Product Details */}
      {product && (
        <div className="space-y-6">
          {/* Basic Product Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">
              ✅ Product Loaded: {product.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Type:</strong> {product.type}
                <br />
                <strong>ID:</strong> {product.id}
                <br />
                <strong>Price:</strong> ${product.price}
              </div>
              <div>
                <strong>Stock:</strong> {product.stock_status}
                <br />
                <strong>Variations:</strong> {product.variations.length}
                <br />
                <strong>Featured:</strong> {product.featured ? "Yes" : "No"}
              </div>
              <div>
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="w-20 h-20 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Attribute Analysis */}
          {variations.length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-3">
                🎯 Attribute Analysis ({variations.length} variations)
              </h3>

              {/* Unique Attributes */}
              <div className="mb-4">
                <h4 className="font-medium text-purple-700 mb-2">
                  Available Attributes:
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const attributeOptions: Record<string, Set<string>> = {};

                    variations.forEach((variation) => {
                      variation.attributes?.forEach((attr) => {
                        if (!attributeOptions[attr.name]) {
                          attributeOptions[attr.name] = new Set();
                        }
                        if (attr.option) {
                          attributeOptions[attr.name].add(attr.option);
                        }
                      });
                    });

                    return Object.entries(attributeOptions).map(
                      ([attrName, optionsSet]) => (
                        <div
                          key={attrName}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <strong className="text-purple-800">
                            {attrName}:
                          </strong>
                          {Array.from(optionsSet).map((option) => (
                            <span
                              key={option}
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>

              {/* Variation List */}
              <div>
                <h4 className="font-medium text-purple-700 mb-2">
                  All Variations:
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {variations.map((variation, index) => (
                    <div
                      key={variation.id}
                      className="p-2 bg-white rounded border text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>
                            Variation {index + 1} (ID: {variation.id})
                          </strong>
                          <br />
                          <span className="text-gray-600">
                            Price: ${variation.price} | Stock:{" "}
                            {variation.stock_status}
                          </span>
                          {variation.attributes &&
                            variation.attributes.length > 0 && (
                              <div className="mt-1">
                                <strong>Attributes:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {variation.attributes.map(
                                    (attr, attrIndex) => (
                                      <span
                                        key={attrIndex}
                                        className="px-1 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                                      >
                                        {attr.name}: {attr.option}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                        {variation.image && (
                          <img
                            src={variation.image.src}
                            alt={
                              variation.image.alt || `Variation ${index + 1}`
                            }
                            className="w-12 h-12 object-cover rounded border ml-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-image.jpg";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Implementation Guide */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">
              💡 Implementation Guide
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>For Variable Products:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  Display attribute selectors (Size, Color, etc.) as buttons or
                  dropdowns
                </li>
                <li>Track selected attributes in state</li>
                <li>
                  Find matching variation when all attributes are selected
                </li>
                <li>
                  Update price, stock, and image based on selected variation
                </li>
                <li>
                  Enable "Add to Cart" only when all required attributes are
                  selected
                </li>
              </ul>

              <p className="mt-3">
                <strong>For Simple Products:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>No attribute selection needed</li>
                <li>"Add to Cart" enabled based on stock status only</li>
              </ul>
            </div>
          </div>

          {/* Test URL */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              🔗 Test This Product
            </h3>
            <p className="text-sm text-yellow-700">
              Visit the product detail page to test attribute selection:
              <br />
              <code className="bg-yellow-100 px-2 py-1 rounded mt-1 inline-block">
                http://localhost:3000/product/{product.id}
              </code>
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          How to Test Attribute Selection:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>
            Select a variable product from the dropdown (products with
            variations)
          </li>
          <li>Click "Load Product & Variations" to fetch the data</li>
          <li>Review the attribute analysis to understand available options</li>
          <li>Visit the product detail page using the provided URL</li>
          <li>Test selecting different attribute combinations</li>
          <li>Verify that prices and stock update correctly</li>
          <li>
            Confirm that "Add to Cart" is only enabled when all attributes are
            selected
          </li>
        </ol>
      </div>
    </div>
  );
};

export default VariableProductDemo;
