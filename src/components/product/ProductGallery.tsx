import React from "react";
import Image from "next/image";
import { Product, ProductVariation } from "@/types/product.interface";

interface ProductGalleryProps {
  product: Product;
  variations?: ProductVariation[];
  images: Array<{ src: string; alt?: string }>;
  mainImage: string;
  productName: string;
  onImageSelect: (imageSrc: string, variationId?: number) => void;
  onSale?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  mainImage,
  productName,
  onImageSelect,
  onSale = false,
  product,
  variations = [],
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

  // Combine all images from product and variations
  const getAllImages = () => {
    const allImages: Array<{
      src: string;
      alt?: string;
      variationId?: number;
      isVariation?: boolean;
    }> = [];

    // Add main product images
    images.forEach((image, index) => {
      allImages.push({
        src: image.src,
        alt: image.alt || `${productName} - Image ${index + 1}`,
        isVariation: false,
      });
    });

    // Add variation images
    variations.forEach((variation) => {
      if (variation.image?.src) {
        // Check if this image is already in the main product images
        const isDuplicate = allImages.some(
          (img) => img.src === variation.image.src
        );

        if (!isDuplicate) {
          allImages.push({
            src: variation.image.src,
            alt: `${productName} - Variation ${variation.id}`,
            variationId: variation.id,
            isVariation: true,
          });
        }
      }
    });

    return allImages;
  };

  const allImages = getAllImages();

  return (
    <div className="px-2 lg:px-8 xl:px-12">
      {/* Main Image */}
      <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-6 relative aspect-square w-full max-w-[600px] mx-auto">
        <Image
          src={mainImage || "/placeholder-image.jpg"}
          alt={productName || "Product image"}
          className="w-full h-full object-cover mix-blend-multiply"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 40vw"
          priority
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
                <span className="text-sm sm:text-lg font-helvetica-medium">
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
      <div className="max-h-48 overflow-y-auto scrollbar-hide">
        <div
          className={`grid gap-3 md:gap-4 ${
            allImages.length <= 4
              ? "grid-cols-4"
              : allImages.length <= 6
              ? "grid-cols-3 sm:grid-cols-6"
              : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          }`}
        >
          {allImages?.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              onClick={() => onImageSelect(image.src, image.variationId)}
              className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 transition-all duration-200 aspect-square relative hover:scale-105 min-w-[80px] min-h-[80px] ${
                mainImage === image.src
                  ? "border-orange-500 shadow-lg"
                  : "border-transparent hover:border-gray-300"
              }`}
              title={
                image.isVariation
                  ? `Variation image - Click to select attributes`
                  : `Product image ${index + 1}`
              }
            >
              <Image
                src={image.src}
                alt={image.alt || `Product image ${index + 1}`}
                className="w-full h-full object-cover mix-blend-multiply"
                fill
                sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 15vw, 12vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.jpg";
                }}
              />
              {/* Variation indicator */}
              {/* {image.isVariation && (
                <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-[8px] px-1 py-0.5 rounded shadow-sm">
                  VAR
                </div>
              )} */}
              {/* Selection indicator */}
              {mainImage === image.src && (
                <div className="absolute top-1 left-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  <svg
                    className="w-2 h-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
