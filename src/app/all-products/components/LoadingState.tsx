interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading products...",
}: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      <div className="ml-4 text-lg text-gray-600">{message}</div>
    </div>
  );
}
