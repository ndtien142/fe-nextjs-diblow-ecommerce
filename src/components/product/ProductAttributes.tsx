import React from "react";
import ColorSwatch from "@/components/ColorSwatch";
import { isColorAttribute } from "@/utils/colorUtils";

interface ProductVariation {
  id: number;
  attributes?: Array<{ name: string; option?: string }>;
}

interface ProductAttributesProps {
  variations: ProductVariation[];
  selectedAttributes: Record<string, string>;
  onAttributeChange: (attributeName: string, value: string) => void;
  areAllAttributesSelected: boolean;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
  variations,
  selectedAttributes,
  onAttributeChange,
  areAllAttributesSelected,
}) => {
  // Get all unique attribute options from variations
  const getAttributeOptions = () => {
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

    // Convert Sets to Arrays for easier rendering
    const result: Record<string, string[]> = {};
    Object.keys(attributeOptions).forEach((key) => {
      result[key] = Array.from(attributeOptions[key]).sort();
    });

    return result;
  };

  const attributeOptions = getAttributeOptions();

  if (Object.keys(attributeOptions).length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {Object.entries(attributeOptions).map(([attributeName, options]) => (
        <div key={attributeName} className="space-y-2">
          <label className="block text-sm font-helvetica-medium text-gray-700">
            {attributeName}
            {!selectedAttributes[attributeName] && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>

          <div
            className={`flex flex-wrap gap-2 ${
              isColorAttribute(attributeName) ? "items-center" : ""
            }`}
          >
            {isColorAttribute(attributeName) ? (
              // Color swatches for color attributes
              <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                  <div
                    key={option}
                    className="flex flex-col items-center gap-1"
                  >
                    <ColorSwatch
                      colorName={option}
                      selected={selectedAttributes[attributeName] === option}
                      onClick={() => onAttributeChange(attributeName, option)}
                      size="md"
                      showTooltip={true}
                    />
                    <span className="text-xs text-gray-600 font-helvetica max-w-16 text-center truncate">
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              // Regular buttons for non-color attributes
              options.map((option) => (
                <button
                  key={option}
                  onClick={() => onAttributeChange(attributeName, option)}
                  className={`px-3 text-[12px] py-2 border rounded-lg transition-all font-helvetica ${
                    selectedAttributes[attributeName] === option
                      ? "border-orange-500 bg-orange-50 text-orange-700 font-helvetica-medium"
                      : "border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      ))}

      {!areAllAttributesSelected && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800 font-helvetica">
            Vui lòng chọn tất cả các tùy chọn bắt buộc để thêm sản phẩm này vào
            giỏ hàng của bạn.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;
