import { PuffLoader } from "react-spinners"

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <PuffLoader color="#000000" />
    </div>
  );
};

export default LoadingSpinner;
