import { lazy } from "react";
import PrivateRoute from "./hooks/Privetroute";
import AuthRoute from "./hooks/Authroute";

const Landing = lazy(() => import("./pages/Landing"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Messages = lazy(() => import("./pages/Messages"));
const Booking = lazy(() => import("./pages/Booking"));
const BlogPost = lazy(() => import("./app/post"));
const Payment = lazy(() => import("./pages/Payment"));
const Notification = lazy(() => import("./pages/Notification"));
const Booked = lazy(() => import("./pages/Booked"));
const Profile = lazy(() => import("./pages/profile"));
const Account = lazy(() => import("./pages/Account"));
const Fallback = lazy(() => import("./components/fallback"));

export const routes = [
  { path: "/", element: <AuthRoute><Landing /></AuthRoute> },
  { path: "/signup", element: <AuthRoute><Signup /></AuthRoute> },
  { path: "/login", element: <AuthRoute><Login /></AuthRoute> },
  { path: "/home", element: <PrivateRoute><Home /></PrivateRoute> },
  { path: "/messages", element: <PrivateRoute><Messages /></PrivateRoute> },
  { path: "/booking", element: <PrivateRoute><Booking /></PrivateRoute> },
  { path: "/post", element: <PrivateRoute><BlogPost /></PrivateRoute> },
  { path: "/payment", element: <PrivateRoute><Payment /></PrivateRoute> },
  { path: "/notification", element: <PrivateRoute><Notification /></PrivateRoute> },
  { path: "/booked", element: <PrivateRoute><Booked /></PrivateRoute> },
  { path: "/profile", element: <PrivateRoute><Profile /></PrivateRoute> },
  { path: "/account", element: <PrivateRoute><Account /></PrivateRoute> },
  { path: "*", element: <PrivateRoute><Fallback /></PrivateRoute> },
];