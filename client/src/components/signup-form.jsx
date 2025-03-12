import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Signup = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    otp: "",
  });
  const [error, setError] = useState({});
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateFeilds = () => {
    let temperror = {};

    const usernameRegex = /^[a-zA-Z0-9\-]+$/;

    if (!formData.username) {
      temperror.username = "User name is required";
    } else if (!usernameRegex.test(formData.username)) {
      temperror.username =
        "Username only contains numbers, alphabets, and '-' (No spaces or special characters)";
    }
    if (!formData.email) {
      temperror.email = "Email is required";
    }
    if (!formData.password) {
      temperror.password = "Password is required";
    }
    if (!formData.cpassword) {
      temperror.cpassword = "Confirm your password";
    } else if (formData.password !== formData.cpassword) {
      temperror.cpassword = "Passwords do not match";
    }
    setError(temperror);
    return Object.keys(temperror).length === 0;
  };

  const handleSendOtp = async (e) => {
    console.log("otp sended");

    e.preventDefault();
    if (validateFeilds()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/send-otp",
          { email: formData.email },{
            withCredentials:true
          }
        );
        setShowOtpPopup(true);
        setError({});
      } catch (err) {
        setError({ general: "Failed to send OTP. Please try again." });
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        formData
      );
      if (response.status === 201) {
        navigate("/login");
      }
      setShowOtpPopup(false);
    } catch (error) {
      setError({ otp: "Invalid OTP." });
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div>

<div className="flex justify-center w-full top-4">
  <img src={logo} alt="logo" className="w-5" />
</div>


       
   <form className={cn("flex flex-col gap-6")} onSubmit={handleSendOtp}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-title mb-2 mt-3">Create a new account</h1>
          <p className="text-sm text-muted-foreground">complete the feilds</p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="your username" value={formData.username} onChange={handleChange} />
            {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@gmai.com" value={formData.email} onChange={handleChange} />
            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cpassword">Password</Label>
            <Input id="cpassword" type="password" placeholder="Re-enter your password" value={formData.cpassword} onChange={handleChange} />
            {error.cpassword && <p className="text-red-500 text-sm">{error.cpassword}</p>}
          </div>
          
          <Button type="submit" className="w-full">Send OTP</Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
            <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google Logo" className="mr-2" />
            Login with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account? <a href="/login" className="underline underline-offset-4">Sign in</a>
        </div>
      </form>
      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
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
      </div>
  );
};

export default Signup;
