import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axios-instance";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "../assets/logo.png";
import { setUserInfo } from "../redux/slice/auth";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    otp: "",
  });
  const [error, setError] = useState({});
  const [showOtpPopup, setShowOtpPopup] = useState(false);

   const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateFields = () => {
    let tempError = {};
    const usernameRegex = /^[a-zA-Z0-9\-]+$/;

    if (!formData.username) {
      tempError.username = "Username is required";
    } else if (!usernameRegex.test(formData.username)) {
      tempError.username =
        "Username only contains numbers, alphabets, and '-' (No spaces or special characters)";
    }
    if (!formData.email) {
      tempError.email = "Email is required";
    }
    if (!formData.password) {
      tempError.password = "Password is required";
    }
    if (!formData.cpassword) {
      tempError.cpassword = "Confirm your password";
    } else if (formData.password !== formData.cpassword) {
      tempError.cpassword = "Passwords do not match";
    }
    setError(tempError);
    return Object.keys(tempError).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setLoading(true);
      try {
        const response = await axiosInstance.post(
          "/auth/send-otp",
          { email: formData.email, username: formData.username },
          { withCredentials: true }
        );
        console.log("OTP sent successfully:", response);
        toast.success("OTP Sent Successfully!");
        setShowOtpPopup(true);
        setError({});
      } catch (err) {
        if (err.response && err.response.data) {
          const errorMessage =
            err.response.data.error || "Failed to send OTP. Please try again.";
          console.log("Error response:", err.response.data);
          toast.error(errorMessage);
        } else {
          console.log("Error sending OTP:", err);
          toast.error("Failed to send OTP. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", formData);
      if (response.status === 201) {
        dispatch(setUserInfo(response.data.user));
        navigate("/login");
        toast.success("OTP Verified Successfully!");
      }
      setShowOtpPopup(false);
    } catch (error) {
      setError({ otp: "Invalid OTP." });
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div>
      <div className="flex justify-center w-full top-4">
        <img src={logo} alt="logo" className="w-5" />
      </div>
      <form className={cn("flex flex-col gap-6")} onSubmit={handleSendOtp}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-title mb-2 mt-3">
            Create a new account
          </h1>
          <p className="text-sm text-muted-foreground">Complete the fields</p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="your username"
              value={formData.username}
              onChange={handleChange}
            />
            {error.username && (
              <p className="text-red-500 text-sm">{error.username}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cpassword">Confirm Password</Label>
            <Input
              id="cpassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.cpassword}
              onChange={handleChange}
            />
            {error.cpassword && (
              <p className="text-red-500 text-sm">{error.cpassword}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
                />
              </svg>
            ) : (
              "Send otp"
            )}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </form>
      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={handleGoogleSignup}
      >
        <img
          src="https://img.icons8.com/color/24/000000/google-logo.png"
          alt="Google Logo"
          className="mr-2"
        />
        Sign up with Google
      </Button>
      <div className="text-center text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Sign in
        </a>
      </div>

      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Enter OTP
            </h3>
            <InputOTP
              maxLength={6}
              value={formData.otp}
              onChange={(otp) => setFormData({ ...formData, otp })}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 mt-3"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Signup;
