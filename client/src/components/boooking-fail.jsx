import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function BookingFail() {

  const navigate = useNavigate()
  const handleRetry = () => {
    navigate('/booking')
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-red-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center"
      >
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Booking Failed</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while processing your booking. <br />
          Please try again or contact support.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-xl transition"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
