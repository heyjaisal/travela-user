import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  FileText,
  MessageCircle,
  Plus,
  Menu,
  X,
  Wallet,
  Settings,
  MessagesSquare,
  Bell,
  ClipboardList,
  CalendarDays,
  User,
} from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Navigation() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileNavbar /> : <DesktopSidebar />;
}

function MobileNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const navigate = useNavigate();
  const userinfo = useSelector((state) => state.auth.userInfo);
  const [image, setImage] = useState(userinfo?.image || null);
  const [firstName, setFirstName] = useState(userinfo?.firstName || "");
  const [email, setEmail] = useState(userinfo?.email || "");

  const handleNavLinkClick = () => {
    setIsSidebarOpen(false);
    setIsBottomNavVisible(false);
  };
  const handleAvatarClick = () => {
    navigate("/profile");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <button
          className="p-4 text-black hover:text-blue-500"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        <nav className="flex flex-col space-y-6 px-6 pb-6 pt-3">
          <NavLink
            to="/home"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            <Home className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Home</span>
          </NavLink>
          <NavLink
            to="/people"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <User className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">People</span>
          </NavLink>
          <NavLink
            to="/messages"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <MessagesSquare className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Messages</span>
          </NavLink>
          <NavLink
            to="/booking"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <CalendarDays className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Bookings</span>
          </NavLink>
          <NavLink
            to="/payment"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Wallet className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Payment</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Bell className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">
              Notifications
            </span>
          </NavLink>
          <NavLink
            to="/booked"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <ClipboardList className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Booked</span>
          </NavLink>
          <NavLink
            to="/account"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Settings className="w-5 h-5 text-black" />
            <span className="text-black text-lg font-medium">Account</span>
          </NavLink>
        </nav>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      {isBottomNavVisible && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-slate-100 px-4 shadow-lg flex justify-between items-center">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-black" />
          </button>
          <NavLink
            to="/booking"
            className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <FileText className="w-6 h-6 text-black" />
          </NavLink>
          <NavLink
            to="/post"
            className="absolute bottom-7 left-1/2 transform -translate-x-1/2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <Plus className="w-6 h-6 text-white" />
          </NavLink>
          <NavLink
            to="/messages"
            className="flex items-center justify-center p-3 rounded-full hover:bg-gray-100 transition duration-300"
            onClick={handleNavLinkClick}
          >
            <MessageCircle className="w-6 h-6 text-black" />
          </NavLink>

          <Avatar
            className="h-6 w-6 md:w-6 md:h-6 rounded-full overflow-hidden cursor-pointer"
            onClick={handleAvatarClick}
          >
            {image ? (
              <AvatarImage
                src={image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div className="uppercase h-6 w-6 md:w-6 md:h-6 text-2xl border-[1px] flex items-center justify-center">
                {(firstName || email)?.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
      )}
    </>
  );
}

function DesktopSidebar() {
  const userinfo = useSelector((state) => state.auth.userInfo);
  const [image, setImage] = useState(userinfo?.image || null);
  const [firstName, setFirstName] = useState(userinfo?.firstName || "");
  const [email, setEmail] = useState(userinfo?.email || "");
  const [isHovered, setIsHovered] = useState(false);

  const firstNameInitial = firstName.charAt(0) || email.charAt(0) || "";

  return (
    <div
      className={`hidden md:flex flex-col ${
        isHovered ? "w-64" : "w-18"
      } text-slate-800 h-full transition-all duration-300 top-0 sticky z-10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavLink to="/profile">
        <div className="flex items-center gap-4 p-3 pt-6 pb-6 pl-4 border-b">
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="uppercase h-full w-full text-3xl flex items-center justify-center border">
                {firstNameInitial}
              </div>
            )}
          </Avatar>
          {isHovered && (
            <h1 className="text-2xl font-title font-bold">Travela</h1>
          )}
        </div>
      </NavLink>

      <nav className="flex-1 m-3 space-y-4">
        <NavItem to="/home" icon={Home} label="Home" isHovered={isHovered} />
        <NavItem
          to="/people"
          icon={User}
          label="People"
          isHovered={isHovered}
        />
        <NavItem
          to="/messages"
          icon={MessageCircle}
          label="Messages"
          isHovered={isHovered}
        />

        <NavItem
          to="/booking"
          icon={CalendarDays}
          label="Booking"
          isHovered={isHovered}
        />

        <NavItem to="/post" icon={Plus} label="Post" isHovered={isHovered} />
        <NavItem
          to="/payment"
          icon={Wallet}
          label="Payment"
          isHovered={isHovered}
        />

        <NavItem
          to="/notification"
          icon={Bell}
          label="Notification"
          isHovered={isHovered}
        />
        <NavItem
          to="/booked"
          icon={ClipboardList}
          label="Booked"
          isHovered={isHovered}
        />

        <NavItem
          to="/account"
          icon={Settings}
          label="Profile"
          isHovered={isHovered}
        />
      </nav>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, isHovered }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 rounded-xl ${
          isActive ? "bg-blue-600 text-white" : ""
        }`
      }
    >
      <Icon className={`${isHovered ? "text-[1.375rem]" : "text-xl"}`} />
      {isHovered && <span>{label}</span>}
    </NavLink>
  );
}
