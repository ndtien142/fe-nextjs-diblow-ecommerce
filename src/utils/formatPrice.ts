/**
 * Format price to Vietnamese Dong (VND) currency
 * @param price - The price value (string or number)
 * @returns Formatted price string with đ symbol
 */
export const formatPrice = (price: string | number): string => {
  // Convert string to number if needed
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Return empty string if price is invalid
  if (isNaN(numericPrice) || numericPrice < 0) {
    return "";
  }

  // Format number with thousand separators and add đ symbol
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice) + "đ"
  );
};
