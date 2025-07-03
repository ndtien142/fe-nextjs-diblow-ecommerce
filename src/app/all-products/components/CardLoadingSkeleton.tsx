interface CardLoadingSkeletonProps {
  count?: number;
}

export default function CardLoadingSkeleton({
  count = 8,
}: CardLoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white w-full rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          {/* Image placeholder */}
          <div className="h-48 w-full bg-gray-200"></div>

          {/* Content area */}
          <div className="p-4 space-y-3">
            {/* Title placeholder */}
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>

            {/* Description placeholder */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Price placeholder */}
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>

            {/* Rating placeholder */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <div
                  key={starIndex}
                  className="h-4 w-4 bg-gray-200 rounded"
                ></div>
              ))}
              <div className="h-3 bg-gray-200 rounded w-8 ml-2"></div>
            </div>

            {/* Button placeholder */}
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
