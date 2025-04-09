import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { useSelector } from "react-redux";

const SuccessProperty = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isProcessing = useRef(false);

  const sessionId = searchParams.get("session_id");
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const capturePayment = async () => {
      if (!sessionId || isProcessing.current) return;
      isProcessing.current = true;
    
      try {
        const response = await axiosInstance.post("/checkout/Pcapture-payment", {
          sessionId,
        });
    
        if (response.data.success) {
          setBooking(response.data);
          setTimeout(() => {
            navigate("/booking-confirmed", { state: response.data, replace: true });
          }, 1000);
        } else {
          throw new Error(response.data.error || "QR Code generation failed");
        }
      } catch (error) {
        setError(error.message);
        setTimeout(() => navigate("/booking-failed"), 2000);
      } finally {
        setIsLoading(false);
      }
    };
    

    capturePayment();
  }, [sessionId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {isLoading ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Processing your booking...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </>
      ) : error ? (
        <h2 className="text-xl font-semibold mb-4 text-red-600">{error}</h2>
      ) : (
        <h2 className="text-xl font-semibold mb-4">Redirecting...</h2>
      )}
    </div>
  );
};

export default SuccessProperty;
