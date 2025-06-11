import React, { useState } from 'react';
import PropertyList from "./Property.jsx";
import Settings from "../app/settings";
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import EventList from './Event';
import BlogList from './Blog'; 

const Saved = () => {
  const [activeTab, setActiveTab] = useState("property");
  const navigate = useNavigate();

  return (
    <div className="p-4 overflow-hidden">
      <div className="flex space-x-4 justify-center p-6 rounded-lg">
        {["property", "events", "blogs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-6 text-lg font-medium border-2 rounded-md transition-all duration-300 ${
              activeTab === tab
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-900 border-gray-400 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        {activeTab === "property" && <PropertyList />}
        {activeTab === "events" && <EventList />}
        {activeTab === "blogs" && <BlogList />} 
      </div>
    </div>
  );
};

export default Saved;
