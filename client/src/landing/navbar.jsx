import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/slice/auth";
import { Button } from "@/components/ui/button";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, SquarePen } from "lucide-react";
import ProfileDialog from "@/app/profile";
import logo from "../assets/logo.png";
import axiosInstance from "@/utils/axios-instance";

const navItems = [
  { label: "Features", id: "/" },
  { label: "Listing", id: "/booking" },
  { label: "Blogs", id: "/blogs" },
  { label: "About us", id: "/about-us" },
];

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userinfo = useSelector((state) => state.auth.userInfo);

  const logOut = async () => {
    const response = await axiosInstance.get(`/auth/logout`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      dispatch(setUserInfo(undefined));
      navigate("/");
    }
  };

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <img src={logo} alt="Travela Logo" className="h-4 w-4 mr-2" />
          <p className="font-bold text-inherit">TRAVELA</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand>
          <img src={logo} alt="Travela Logo" className="h-4 w-4 mr-2" />
          <p className="font-bold text-inherit">TRAVELA</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex cursor-pointer gap-4" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.id}>
            <Link color="foreground" onClick={() => navigate(item.id)}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="flex items-center gap-4">
        {userinfo ? (
          <>
            <Link href="/post">
              <Plus className="w-7 h-8 text-gray-600" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-8 h-8">
                  <AvatarImage src={userinfo?.image} alt={userinfo?.username} />
                  <AvatarFallback>{userinfo?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/booked")}>Booked</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/notification")}>Notification</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/messages")}>Messages</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/saved")}>Saved</DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Profile Dialog Trigger */}
                <ProfileDialog />
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={logOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex cursor-pointer">
              <Link onClick={() => navigate("/login")}>Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button variant="flat" className="bg-slate-200 text-black cursor-pointer" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarMenuItem key={item.id}>
            <Link className="w-full cursor-pointer" color="foreground" onClick={() => navigate(item.id)}>
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
