import React from "react";
import Image from "next/image";
import { Product } from "@/types/product.interface";

interface ProductGalleryProps {
  product: Product;
  images: Array<{ src: string; alt?: string }>;
  mainImage: string;
  productName: string;
  onImageSelect: (imageSrc: string) => void;
  onSale?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  mainImage,
  productName,
  onImageSelect,
  onSale = false,
  product,
}) => {
  // Calculate sale percentage
  const calculateSalePercentage = (): number => {
    if (!product?.on_sale || !product.regular_price || !product.sale_price) {
      return 0;
    }

    const regularPrice = parseFloat(product.regular_price.toString());
    const salePrice = parseFloat(product.sale_price.toString());

    if (regularPrice <= 0 || salePrice <= 0) {
      return 0;
    }

    const discount = regularPrice - salePrice;
    const percentage = Math.round((discount / regularPrice) * 100);

    return percentage;
  };

  return (
    <div className="px-5 lg:px-16 xl:px-20">
      {/* Main Image */}
      <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 relative">
        <Image
          src={mainImage || "/placeholder-image.jpg"}
          alt={productName || "Product image"}
          className="w-full h-auto object-cover mix-blend-multiply"
          width={1280}
          height={720}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-image.jpg";
          }}
        />
        {product?.on_sale && calculateSalePercentage() > 0 && (
          <div className="absolute top-0 left-0 w-[50px] h-[50px] z-10">
            <div
              className="w-full py-1.5 text-sm text-[#333] bg-[#FDD464] rounded border-b-r-[1px] mx-auto
                      after:absolute after:content-[''] after-w-[25px] after:inline-block after-border after:border-solid after:border-t-[5px] after:bottom-[-2px]  sm:after:bottom-[-10px] after:border-t-solid after:border-t-[#FDD464] after:border-l-[24px] after:border-r-[25px] after:border-l-transparent after:border-r-transparent after:border-r-solid after:border-l-solid"
              style={{
                borderBottomRightRadius: "1px",
                borderBottomLeftRadius: "1px",
              }}
            >
              <div className="mb-[0.5px] text-center py-0">
                <span className="text-sm sm:text-lg font-futura-medium">
                  {calculateSalePercentage()}
                </span>
                <span className="text-[10px]">%</span>
              </div>
              <span className="block text-center text-[10px]">off</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {images?.map((image, index) => (
          <div
            key={index}
            onClick={() => onImageSelect(image.src)}
            className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 transition-colors ${
              mainImage === image.src
                ? "border-orange-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt || `Product image ${index + 1}`}
              className="w-full h-auto object-cover mix-blend-multiply"
              width={320}
              height={320}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
