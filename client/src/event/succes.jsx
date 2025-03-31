import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { useSelector } from "react-redux";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isProcessing = useRef(false);

  const sessionId = searchParams.get("session_id");
  const eventId = searchParams.get("event_id");
  const ticketsBooked = searchParams.get("tickets");
  const totalAmount = searchParams.get("amount");
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const processPayment = async () => {
      if (isProcessing.current) return; // Prevent duplicate requests
      isProcessing.current = true;

      console.log("Processing payment with:", { sessionId, eventId, ticketsBooked, totalAmount, userInfo });

      try {
        if (!sessionId || !eventId || !ticketsBooked || !totalAmount) {
          throw new Error("Missing required payment information");
        }

        if (!userInfo?.id) {
          throw new Error("User authentication required");
        }

        const response = await axiosInstance.post("/checkout/capture-payment", {
          sessionId,
          user: userInfo.id,
          event: eventId,
          ticketsBooked: parseInt(ticketsBooked, 10),
          totalAmount: parseFloat(totalAmount),
        });

        if (response.data.success) {
          navigate("/booking-confirmed", { replace: true });
        } else {
          throw new Error(response.data.error || "Payment processing failed");
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Payment capture failed:", error);
          setError(error.message);
          setTimeout(() => navigate("/booking-failed"), 2000);
        }
      } finally {
        isProcessing.current = false;
        setIsLoading(false);
      }
    };

    processPayment();
  }, [sessionId, eventId, ticketsBooked, totalAmount, userInfo, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
        <button
          onClick={() => navigate(`/event/${eventId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Return to Event
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {isLoading ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Processing your payment...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </>
      ) : (
        <h2 className="text-xl font-semibold mb-4">Redirecting...</h2>
      )}
    </div>
  );
};

export default Success;
