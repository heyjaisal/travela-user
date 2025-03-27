import React, { useState } from 'react';
import PropertyList from "../landing/property"; 
import Settings from "../app/settings";
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import EventList from './events';

const Account = () => {
  const [activeTab, setActiveTab] = useState("property");
  const navigate = useNavigate(); 

  return ( 
    <div className="p-4 overflow-hidden">

      <div className="flex space-x-4 justify-center p-6 rounded-lg">
        <button
          onClick={() => setActiveTab("property")}
          className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${activeTab === "property" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"}`}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${activeTab === "events" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"}`}
        >
          Events
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide"> 
        {activeTab === "property" ? <PropertyList /> : <EventList />}
      </div>
    </div>
  );
};

export default Account;
