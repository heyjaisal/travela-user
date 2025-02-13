import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { setUserInfo } from "./redux/slice/auth";
import axios from "axios";
import Signup from "./pages/Signup";
import NavbarLayout from "./components/Navbar/navbar-layout";
import Login from "./pages/Login";
import Profile from "./pages/Account";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Messages from "./pages/Messages";
import Booking from "./pages/Booking";
import BlogPost from "./app/blog-post";
import Payment from "./pages/Payment";
import Notification from "./pages/Notification";
import Booked from "./pages/Booked";
import Account from "./pages/Account";


const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/home" /> : children;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!userInfo) {
      const getUser = async () => {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/auth/profile", { withCredentials: true });
          console.log(response);
          
          if (response.status === 200 && response.data.id) {
            dispatch(setUserInfo(response.data));
          } else {
            dispatch(setUserInfo(undefined));
            console.log("no user info");
          }
        } catch (error) {
          dispatch(setUserInfo(undefined));
        } finally {
          setLoading(false);
        }
      };

      getUser();
    }
  }, [userInfo, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" aria-label="loading" style={{ display: 'block' }} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute><Landing /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route element={<NavbarLayout />}>
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route path="/post" element={<PrivateRoute><BlogPost/></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/notification" element={<PrivateRoute><Notification /></PrivateRoute>} />
        <Route path="/booked" element={<PrivateRoute><Booked /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="*"element={<PrivateRoute><Login /> </PrivateRoute>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
