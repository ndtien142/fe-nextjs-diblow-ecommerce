interface ProductHeaderProps {
  categoryName: string;
  totalProducts: number;
}

export default function ProductHeader({
  categoryName,
  totalProducts,
}: ProductHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-helvetica-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <div className="w-20 h-[1px] bg-black rounded-full"></div>
        </div>
        <div className="text-sm text-gray-600 font-helvetica">
          {totalProducts} sản phẩm
        </div>
      </div>
    </div>
  );
}
