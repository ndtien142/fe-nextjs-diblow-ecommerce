import React from "react";

interface ProductDetailsTableProps {
  product: {
    sku?: string;
    categories?: Array<{ name: string }>;
    weight?: string;
  };
  stockStatus: string;
  selectedVariation?: number | null;
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  product,
  stockStatus,
  selectedVariation,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full max-w-72">
        <tbody>
          <tr>
            <td className="text-gray-600 font-medium py-1">SKU</td>
            <td className="text-gray-800/50 py-1">{product.sku || "N/A"}</td>
          </tr>
          <tr>
            <td className="text-gray-600 font-medium py-1">Stock</td>
            <td className="text-gray-800/50 py-1">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  stockStatus === "instock"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {stockStatus === "instock" ? "In Stock" : "Out of Stock"}
              </span>
              {selectedVariation && (
                <span className="ml-2 text-xs text-gray-500">
                  (Selected variation)
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td className="text-gray-600 font-medium py-1">Category</td>
            <td className="text-gray-800/50 py-1">
              {product.categories?.[0]?.name || "Uncategorized"}
            </td>
          </tr>
          {product.weight && (
            <tr>
              <td className="text-gray-600 font-medium py-1">Weight</td>
              <td className="text-gray-800/50 py-1">{product.weight}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetailsTable;
