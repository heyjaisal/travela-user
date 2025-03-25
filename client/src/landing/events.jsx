import React from "react";
import { useNavigate } from "react-router-dom";

const properties = [
  { id: 1, name: "Beachfront Villa", price: "$200/night", image: "https://a0.muscache.com/im/pictures/miso/Hosting-986006657560562155/original/58f672af-308b-4763-bb92-0eb58fd26a71.jpeg?im_w=720" },
  { id: 2, name: "Mountain Cabin", price: "$150/night", image: "https://a0.muscache.com/im/pictures/miso/Hosting-1286208323180296244/original/f65a60fb-8865-4901-8cdb-70820b1e4da7.jpeg?im_w=720" },
  { id: 3, name: "City Apartment", price: "$180/night", image: "https://a0.muscache.com/im/pictures/1f807200-46a7-4afb-99da-e41a816a71f2.jpg?im_w=720" },
  { id: 4, name: "Lake House", price: "$220/night", image: "https://a0.muscache.com/im/pictures/miso/Hosting-765035139021378595/original/fc8f45e8-33c4-4d08-8008-924133bda3bc.jpeg?im_w=720" },
  { id: 5, name: "Beachfront Villa", price: "$200/night", image: "https://a0.muscache.com/im/pictures/miso/Hosting-986006657560562155/original/58f672af-308b-4763-bb92-0eb58fd26a71.jpeg?im_w=720" },
  { id: 6, name: "Mountain Cabin", price: "$150/night", image: "https://a0.muscache.com/im/pictures/miso/Hosting-1286208323180296244/original/f65a60fb-8865-4901-8cdb-70820b1e4da7.jpeg?im_w=720" },
  { id: 7, name: "City Apartment", price: "$180/night", image: "https://a0.muscache.com/im/pictures/1f807200-46a7-4afb-99da-e41a816a71f2.jpg?im_w=720" },
  { id: 8, name: "Lake House", price: "$220/night", image: "https://a0.muscache.com/im/pictures/miso/Hosting-765035139021378595/original/fc8f45e8-33c4-4d08-8008-924133bda3bc.jpeg?im_w=720" }
];

const PropertyList = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center gap-4 px-4 py-2">
        {properties.map((property) => (
          <div key={property.id} className="min-w-[300px] bg-lightBg  rounded-lg p-4">
            <img src={property.image} alt={property.name} className="w-full h-40 object-cover rounded-md" />
            <h3 className="mt-2 text-lg font-semibold">{property.name}</h3>
            <p className="text-gray-600">{property.price}</p>
          </div>
        ))}
        <button
          onClick={() => navigate("/all-properties")}
          className="min-w-[50px] h-[50px] bg-gray-200 text-gray-700 font-semibold rounded-full flex items-center justify-center text-xl"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default PropertyList;
