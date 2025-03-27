import React, { useState } from 'react';
import PropertyList from "../landing/property"; 
import Settings from "../app/settings";
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate(); 

  const handleClose = () => {
    navigate("/");
  };

  return ( 
    <div className="p-4 bg-lightBg overflow-hidden">
      <h1 className="text-xl pl-3.5 pt-2 font-bold">Account</h1>

      {/* Updated button design */}
      <div className="flex space-x-4 justify-center p-6 rounded-lg">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${activeTab === "profile" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"}`}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${activeTab === "settings" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"}`}
        >
          Settings
        </button>
      </div>

      <button onClick={handleClose} className="absolute top-4 right-4 text-gray-700">
        <X className="w-6 h-6" />
      </button>

      <div className="overflow-x-auto scrollbar-hide"> 
        {activeTab === "profile" ? <PropertyList /> : <Settings />}
      </div>
    </div>
  );
};

export default Account;
