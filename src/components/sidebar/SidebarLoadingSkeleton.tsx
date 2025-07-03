interface SidebarLoadingSkeletonProps {
  itemCount?: number;
  showHeader?: boolean;
  showCloseButton?: boolean;
}

export default function SidebarLoadingSkeleton({
  itemCount = 8,
  showHeader = true,
  showCloseButton = false,
}: SidebarLoadingSkeletonProps) {
  return (
    <div className="h-full bg-white">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4">
          {showCloseButton && (
            <div className="md:hidden p-2 rounded-full">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
        </div>
      )}

      {/* Category List Skeleton */}
      <div className="overflow-y-auto h-full pb-20 px-4">
        <div className="space-y-2">
          {Array.from({ length: itemCount }).map((_, index) => (
            <div key={index} className="animate-pulse">
              {/* Main category item */}
              <div className="flex items-center py-1.5 pl-5">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Randomly show subcategories for some items */}
              {index % 3 === 0 && (
                <div className="ml-4 space-y-1">
                  {Array.from({
                    length: Math.floor(Math.random() * 3) + 1,
                  }).map((_, subIndex) => (
                    <div key={subIndex} className="flex items-center py-1 pl-8">
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
