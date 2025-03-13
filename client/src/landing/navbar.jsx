import { Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  

  return (
    <nav className="bg-gray-900 text-white p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-500 rounded" /> {/* Placeholder for Logo */}
        <span className="text-lg font-semibold">Travela</span>
      </div>
      <div className="hidden md:flex space-x-6">
        <a href="#" className="hover:text-gray-400 transition pt-1">Contact us</a>
        <a href="#" className="hover:text-gray-400 transition pt-1">Login</a>
        <button className="bg-blue-500 px-4 py-1 rounded-full hover:bg-blue-600 transition font-mono">
          Sign Up
        </button>
      </div>
      <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        <Menu/>
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-transparent p-4 flex flex-col items-center space-y-4 md:hidden">
          <a  onClick={()=>{setIsOpen(false); navigate('/contact-us')}} href="#" className="hover:text-gray-400 transition text-black">Contact us</a>
          <a onClick={()=>{setIsOpen(false); navigate('/login')}} className="hover:text-gray-400 transition text-black">Login</a>
          <button  onClick={()=>{setIsOpen(false); navigate('/signup')}} className="bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600 transition">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}