import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

const propertyTypes = [
  { name: "Beachfront", image: "https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg" },
  { name: "A-frames", image: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg" },
  { name: "Countryside", image: "https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg" },
  { name: "Amazing pools", image: "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" },
  { name: "Treehouses", image: "https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg" },
  { name: "Rooms", image: "https://a0.muscache.com/pictures/7630c83f-96a8-4232-9a10-0398661e2e6f.jpg" },
  { name: "Castles", image: "https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg" },
  { name: "OMG!", image: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg" },
  { name: "Tiny homes", image: "https://a0.muscache.com/pictures/3271df99-f071-4ecf-9128-eb2d2b1f50f0.jpg" },
  { name: "Cabins", image: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg" },
  { name: "Beachfront", image: "https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg" },
  { name: "A-frames", image: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg" },
  { name: "Countryside", image: "https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg" },
  { name: "Amazing pools", image: "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg" },
  { name: "Treehouses", image: "https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg" },
  { name: "Rooms", image: "https://a0.muscache.com/pictures/7630c83f-96a8-4232-9a10-0398661e2e6f.jpg" },
  { name: "Castles", image: "https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg" },
  { name: "OMG!", image: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg" },
  { name: "Tiny homes", image: "https://a0.muscache.com/pictures/3271df99-f071-4ecf-9128-eb2d2b1f50f0.jpg" },
  { name: "Cabins", image: "https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg" },
];

const PropertyTypeFilter = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <button onClick={() => scroll("left")} className="p-2 border rounded-full">
        <ChevronLeft size={18} />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 scrollbar-hide px-2 flex-1"
      >
        {propertyTypes.map((type, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer hover:text-black">
            <img src={type.image} alt={type.name} className="w-6 h-6 mb-1" />
            <span className="text-sm text-gray-700 whitespace-nowrap">{type.name}</span>
          </div>
        ))}
      </div>

      <button onClick={() => scroll("right")} className="p-2 border rounded-full">
        <ChevronRight size={18} />
      </button>

      <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm">
        <Filter size={16} />
        Filters
      </button>

  
    </div>
  );
};

export default PropertyTypeFilter;
