import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserInfo } from "../redux/slice/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../assets/logo.png";

const LoginForm = ({ className, ...props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Enter a valid email";

    if (!password) errors.password = "Password is required";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      setError("");
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });

        dispatch(setUserInfo(response.data.user));

        if (response.data.user.id) {
          navigate(response.data.user.profileSetup || userInfo.id ? "/home" : "/profile");
        }
      } catch (err) {
        setError(err?.response?.data?.error || "Login failed. Please try again.");
        console.error("Login error:", err);
      }
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleLogin} {...props}>
      
      <div className="flex justify-center w-full top-4">
        <img src={logo} alt="logo" className="w-5" />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-title mb-5">Login to your account</h1>
        <p className="text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
        </div>
        <Button type="submit" className="w-full">Login</Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
          <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google Logo" className="mr-2" />
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account? <a href="/signup" className="underline underline-offset-4">Sign up</a>
      </div>
    </form>
  );
};

export default LoginForm;
