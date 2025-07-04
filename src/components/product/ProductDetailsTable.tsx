import React from "react";

interface ProductDetailsTableProps {
  product: {
    sku?: string;
    categories?: Array<{ name: string }>;
    weight?: string;
  };
  stockStatus: string;
  stockQuantity?: number | null;
  manageStock?: boolean;
  selectedVariation?: number | null;
  isVariableProduct?: boolean;
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  product,
  stockStatus,
  stockQuantity,
  manageStock = false,
  selectedVariation,
  isVariableProduct = false,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full max-w-72">
        <tbody>
          <tr>
            <td className="text-gray-600 font-medium py-1">Mã sản phẩm</td>
            <td className="text-gray-800/50 py-1">{product.sku || "N/A"}</td>
          </tr>
          <tr>
            <td className="text-gray-600 font-medium py-1">Tình trạng</td>
            <td className="text-gray-800/50 py-1">
              <div className="flex items-center gap-2">
                {isVariableProduct && !selectedVariation ? (
                  <span className="text-xs text-gray-600">
                    Chọn biến thể để xem tình trạng kho
                  </span>
                ) : (
                  <>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        stockStatus === "instock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {stockStatus === "instock" ? "Còn hàng" : "Hết hàng"}
                    </span>
                    {manageStock &&
                      stockQuantity !== null &&
                      stockStatus === "instock" && (
                        <span
                          className={`text-xs ${
                            (stockQuantity || 0) <= 5
                              ? "text-orange-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          ({stockQuantity} sản phẩm có sẵn)
                          {(stockQuantity || 0) <= 5 && (
                            <span className="ml-1 text-orange-600">
                              ⚠️ Sắp hết hàng
                            </span>
                          )}
                        </span>
                      )}
                  </>
                )}
              </div>
              {selectedVariation && (
                <span className="block text-xs text-gray-500 mt-1">
                  (Biến thể đã chọn: #{selectedVariation})
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetailsTable;
