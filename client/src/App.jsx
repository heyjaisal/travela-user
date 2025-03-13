import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import { setUserInfo } from "./redux/slice/auth";
import Navbar from "./components/Navbar/navbar";
import BlogDetail from "./blog/blog";

const NavbarLayout = lazy(() => import("./components/Navbar/navbar-layout"));
const PrivateRoute = lazy(() => import("./hooks/Privetroute"));
const AuthRoute = lazy(() => import("./hooks/Authroute"));


const Landing = lazy(() => import("./landing/Landing"));
const Signup = lazy(() => import("./auth/Signup"));
const Login = lazy(() => import("./auth/Login"));
const Home = lazy(() => import("./pages/Home"));
const People = lazy(()=>import('./pages/people'))
const Messages = lazy(() => import("./pages/Messages"));
const Booking = lazy(() => import("./pages/Booking"));
const BlogPost = lazy(() => import("./blog/post"));
const BlogDetial = lazy(()=>import("./blog/blog"))
const Payment = lazy(() => import("./pages/Payment"));
const Notification = lazy(() => import("./pages/Notification"));
const Booked = lazy(() => import("./pages/Booked"));
const Profile = lazy(() => import("./pages/profile"));
const Account = lazy(() => import("./pages/Account"));
const Fallback = lazy(() => import("./components/fallback"));

const App = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  console.log(userInfo);
  

  useEffect(() => {
    if (!userInfo) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/auth/profile", { withCredentials: true });
          if (response.status === 200 && response.data.id) {
            dispatch(setUserInfo(response.data));
          } else {
            dispatch(setUserInfo(undefined));
          }
        } catch (error) {
          dispatch(setUserInfo(undefined));
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userInfo, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" aria-label="loading" />
      </div>
    );
  }

  return (
    <Router>
        
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><ScaleLoader color="#C0C2C9" aria-label="loading" /></div>}>
        <Routes>
          <Route path="/" element={<AuthRoute><Landing /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
       
          <Route element={<NavbarLayout />}>
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/people" element={<PrivateRoute><People/></PrivateRoute>} />
            <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
            <Route path="/post" element={<PrivateRoute><BlogPost /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/notification" element={<PrivateRoute><Notification /></PrivateRoute>} />
            <Route path="/booked" element={<PrivateRoute><Booked /></PrivateRoute>} />
            <Route path="/blog/:id" element={<PrivateRoute><BlogDetial /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path="*" element={<PrivateRoute><Fallback /></PrivateRoute>} />
          </Route>
          
        </Routes>
      </Suspense>
   
    </Router>
  

  );
};

export default App;
