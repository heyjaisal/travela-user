import { ScaleLoader } from "react-spinners";

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <ScaleLoader color="#C0C2C9" aria-label="loading" />
  </div>
);