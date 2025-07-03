import React from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: Array<{ src: string; alt?: string }>;
  mainImage: string;
  productName: string;
  onImageSelect: (imageSrc: string) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  mainImage,
  productName,
  onImageSelect,
}) => {
  return (
    <div className="px-5 lg:px-16 xl:px-20">
      {/* Main Image */}
      <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
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
