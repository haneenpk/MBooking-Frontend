const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-gray-300 rounded-full border-t-4 border-b-4 h-12 w-12 mr-2 animate-spin"></div>
      <span className="text-gray-500">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
