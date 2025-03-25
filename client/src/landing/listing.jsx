import React, { useState } from 'react';

const SwitchButtons = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex space-x-4 justify-center p-6 rounded-lg">
      <button
        onClick={() => setActiveTab("profile")}
        className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${activeTab === "profile" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"}`}
      >
        Profile
      </button>
      <button
        onClick={() => setActiveTab("settings")}
        className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${activeTab === "settings" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"}`}
      >
        Settings
      </button>
    </div>
  );
};

export default SwitchButtons;