import React, { useState } from "react";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useProducts } from "@/hooks/useProducts";

const ProductDetailDemo: React.FC = () => {
  const [productId, setProductId] = useState<string>("");
  const [fetchVariations, setFetchVariations] = useState(true);

  // Get list of products to select from
  const { products } = useProducts({ strategy: "all", per_page: 10 });

  // Fetch product details
  const { product, variations, loading, error, refetch } = useProductDetail(
    productId,
    {
      autoFetch: false,
      fetchVariations,
    }
  );

  const handleFetchProduct = () => {
    if (productId) {
      refetch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Product Detail API Test
      </h2>

      {/* Product Selection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">
          Select Product to Test
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
              Or select from available products:
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id.toString()}>
                  {product.name} (ID: {product.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={fetchVariations}
              onChange={(e) => setFetchVariations(e.target.checked)}
              className="mr-2"
            />
            Fetch product variations
          </label>
        </div>

        <button
          onClick={handleFetchProduct}
          disabled={!productId || loading}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Fetching..." : "Fetch Product Details"}
        </button>
      </div>

      {/* API Endpoint Info */}
      {productId && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">API Endpoints:</h3>
          <div className="space-y-1 text-sm">
            <div>
              <strong>Product:</strong>{" "}
              <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded">
                /api/products/{productId}
              </code>
            </div>
            {fetchVariations && (
              <div>
                <strong>Variations:</strong>{" "}
                <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  /api/products/{productId}/variations
                </code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading product details...</p>
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
              ✅ Product Details Loaded
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  {product.name}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <strong>ID:</strong> {product.id}
                  </div>
                  <div>
                    <strong>SKU:</strong> {product.sku || "N/A"}
                  </div>
                  <div>
                    <strong>Price:</strong> ${product.price}
                  </div>
                  <div>
                    <strong>Stock:</strong> {product.stock_status}
                  </div>
                  <div>
                    <strong>Type:</strong> {product.type}
                  </div>
                  <div>
                    <strong>Featured:</strong> {product.featured ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div>
                {product.images && product.images.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">
                      Product Image
                    </h5>
                    <img
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variations */}
          {variations.length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-3">
                🔄 Product Variations ({variations.length})
              </h3>
              <div className="space-y-3">
                {variations.map((variation, index) => (
                  <div
                    key={variation.id}
                    className="p-3 bg-white rounded border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          Variation {index + 1}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <strong>ID:</strong> {variation.id}
                          </div>
                          <div>
                            <strong>SKU:</strong> {variation.sku || "N/A"}
                          </div>
                          <div>
                            <strong>Price:</strong> ${variation.price}
                          </div>
                          <div>
                            <strong>Stock:</strong> {variation.stock_status}
                          </div>
                          {variation.attributes &&
                            variation.attributes.length > 0 && (
                              <div>
                                <strong>Attributes:</strong>
                                <ul className="ml-4 mt-1">
                                  {variation.attributes.map(
                                    (attr, attrIndex) => (
                                      <li key={attrIndex} className="text-xs">
                                        {attr.name}: {attr.option}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                      {variation.image && (
                        <img
                          src={variation.image.src}
                          alt={variation.image.alt || `Variation ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
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
          )}

          {/* Raw JSON Data */}
          <details className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <summary className="cursor-pointer font-medium text-gray-800 mb-2">
              📄 Raw Product Data (JSON)
            </summary>
            <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-auto max-h-96">
              {JSON.stringify(
                {
                  id: product.id,
                  name: product.name,
                  sku: product.sku,
                  price: product.price,
                  regular_price: product.regular_price,
                  sale_price: product.sale_price,
                  on_sale: product.on_sale,
                  stock_status: product.stock_status,
                  stock_quantity: product.stock_quantity,
                  type: product.type,
                  featured: product.featured,
                  categories: product.categories,
                  images: product.images?.map((img) => ({
                    id: img.id,
                    src: img.src,
                    alt: img.alt,
                  })),
                  attributes: product.attributes,
                  variations: product.variations,
                  total_sales: product.total_sales,
                  average_rating: product.average_rating,
                  rating_count: product.rating_count,
                },
                null,
                2
              )}
            </pre>
          </details>

          {variations.length > 0 && (
            <details className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <summary className="cursor-pointer font-medium text-gray-800 mb-2">
                🔄 Raw Variations Data (JSON)
              </summary>
              <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-auto max-h-96">
                {JSON.stringify(variations, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How to Use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Enter a product ID manually or select from the dropdown</li>
          <li>Choose whether to fetch variations (for variable products)</li>
          <li>Click "Fetch Product Details" to test the API</li>
          <li>Review the loaded data and check for any errors</li>
          <li>Use the raw JSON data for debugging</li>
        </ol>
      </div>
    </div>
  );
};

export default ProductDetailDemo;
