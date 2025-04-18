import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { setUserInfo } from "./redux/slice/auth";
import Navbar from "./landing/navbar";
import axiosInstance from "./utils/axios-instance";
import Bookingsucces from "./event/booking-succes";
import Boookingfail from "./event/boooking-fail";
import Success from "./property/succes";

const Landing = lazy(() => import("./landing/Landing"));
const Signup = lazy(() => import("./auth/Signup"));
const Login = lazy(() => import("./auth/Login"));
const Home = lazy(() => import("./pages/Home"));
const People = lazy(() => import("./pages/people"));
const Messages = lazy(() => import("./pages/Messages"));
const Booking = lazy(() => import("./pages/Booking"));
const BlogPost = lazy(() => import("./blog/post"));
const BlogDetail = lazy(() => import("./blog/blog"));
const Payment = lazy(() => import("./pages/Payment"));
const Notification = lazy(() => import("./pages/Notification"));
const Booked = lazy(() => import("./pages/Booked"));
const Profile = lazy(() => import("./pages/profile"));
const Account = lazy(() => import("./pages/Account"));
const UserProfile = lazy(() => import("./users/user-profile"));
const HostProfile = lazy(() => import("./users/host-profile"));
const EventPage = lazy(() => import("./event/event-page"));
const PropertyPage = lazy(() => import("./property/property-page"));
const AboutUs = lazy(() => import("./landing/about-us"));
const Fallback = lazy(() => import("./components/fallback"));
const ECheckout = lazy(() => import("./event/succes"));

const App = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (!userInfo) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get("/auth/profile", {
            withCredentials: true,
          });
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
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <ScaleLoader color="#C0C2C9" aria-label="loading" />
          </div>
        }
      >
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/blogs" element={<Home />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/post" element={<BlogPost />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/notification" element={<Notification />} />
                  <Route path="/booked" element={<Booked />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/event-success" element={<ECheckout />} />
                  <Route path="/property-success" element={<Success />} />
                  <Route
                    path="/booking-confirmed"
                    element={<Bookingsucces />}
                  />
                  <Route path="/booking-failed" element={<Boookingfail />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/user/:id" element={<UserProfile />} />
                  <Route path="/host/:id" element={<HostProfile />} />
                  <Route path="/event/:id" element={<EventPage />} />
                  <Route path="/property/:id" element={<PropertyPage />} />
                  <Route path="*" element={<Fallback />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
