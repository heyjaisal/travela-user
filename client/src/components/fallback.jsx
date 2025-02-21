import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const fallback = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="relative bg-white min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
  <div className="absolute top-2 left-2 flex items-center space-x-2">
    <img src={logo} alt="logo" className="w-8 h-8" />
    <h1 className="text-5xl font-title">Travela</h1>
  </div>

  <h1 className="text-slate-700 text-9xl font-title mb-4">404</h1>
  <p onClick={handleClose} className="text-xl mt-5 font-title underline cursor-pointer">Back to Home page</p>
</div>

  );
};

export default fallback;
