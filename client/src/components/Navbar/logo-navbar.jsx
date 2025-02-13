import React from "react";
import logo from "../../assets/logo.png";

const logoNavbar = () => {
  return (
    <div>
    <nav className="z-10 sticky top-10 flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-gray-300 bg-white">
      <img src={logo} alt="logo" className="flex-none " />
    </nav>
    </div>
  );
};

export default logoNavbar;
