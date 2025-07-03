interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-red-500 text-lg font-medium mb-2">
        Error loading products
      </div>
      <div className="text-gray-500 text-sm mb-4">{error}</div>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
      >
        Thử lại
      </button>
    </div>
  );
}
