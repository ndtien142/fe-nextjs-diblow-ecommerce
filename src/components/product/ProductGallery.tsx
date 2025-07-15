import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, ProductVariation } from "@/types/product.interface";
import { assets } from "@/assets/assets";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Update current image index when main image changes
  useEffect(() => {
    const currentIndex = allImages.findIndex((img) => img.src === mainImage);
    if (currentIndex !== -1) {
      setCurrentImageIndex(currentIndex);
    }
  }, [mainImage, allImages]);

  // Navigation functions
  const goToPrevious = () => {
    const newIndex =
      currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    onImageSelect(allImages[newIndex].src, allImages[newIndex].variationId);
  };

  const goToNext = () => {
    const newIndex =
      currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    onImageSelect(allImages[newIndex].src, allImages[newIndex].variationId);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentImageIndex, allImages]);

  // Touch/swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && allImages.length > 1) {
      goToNext();
    }
    if (isRightSwipe && allImages.length > 1) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="px-2 lg:px-8 xl:px-12">
      {/* Main Image */}
      <div
        className="rounded-lg overflow-hidden  mb-6 relative aspect-square w-full max-w-[600px] mx-auto group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 z-20 
                         opacity-100 md:opacity-0 md:group-hover:opacity-100 
                         shadow-lg border border-gray-200"
              aria-label="Previous image"
            >
              <Image
                src={assets.arrow_icon}
                alt="Previous"
                width={16}
                height={16}
                className="rotate-180"
              />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 z-20 
                         opacity-100 md:opacity-0 md:group-hover:opacity-100 
                         shadow-lg border border-gray-200"
              aria-label="Next image"
            >
              <Image
                src={assets.arrow_icon}
                alt="Next"
                width={16}
                height={16}
              />
            </button>

            {/* Image Counter */}
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-1 rounded-full text-sm z-20 
                            opacity-100 md:opacity-0 md:group-hover:opacity-100 
                            transition-all duration-200 shadow-lg border border-gray-200"
            >
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}

        {/* Sale Badge */}
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
