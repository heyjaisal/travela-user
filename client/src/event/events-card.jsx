import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axios-instance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
} from "@heroui/react";

const EventCard = ({
  images,
  eventVenue,
  ticketPrice,
  country,
  city,
  _id,
  isSaved,
  averageRating,
}) => {
  const [Saved, setIsSaved] = useState(isSaved);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const [selectedReasons, setSelectedReasons] = useState([]);

  const reasons = [
    "Inappropriate content",
    "Scam or misleading",
    "Hate speech",
    "Violence",
    "Spam",
    "Other",
  ];

  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.post(
        `/user/save/${_id}`,
        { type: "event" },
        { withCredentials: true }
      );
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error("Error saving event:", error.response?.data || error.message);
    }
  };

  const handleClick = () => {
    navigate(`/event/${_id}`);
  };

  const handleReportConfirm = async () => {
    console.log("Reported reasons:", selectedReasons);

    try {
      await axiosInstance.post(`/user/report/Event/${_id}`, {
        reasons: selectedReasons,
      });
    } catch (err) {
      console.error("Report error:", err.response?.data || err.message);
    }

    onOpenChange(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div
      className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      {userInfo && (
        <div className="absolute bottom-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              >
                Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {userInfo && (
        <button onClick={handleSave} className="absolute top-2 right-2 p-2 z-10">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="grey"
            strokeWidth="2"
            className="w-6 h-6"
            animate={{ scale: Saved ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <motion.path
              fill={Saved ? "red" : "white"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </motion.svg>
        </button>
      )}

      <div className="overflow-hidden">
        {images.length > 1 ? (
          <Slider {...settings} className="rounded-xl">
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Property ${index + 1}`}
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={images[0]}
            alt="Property"
            className="w-full h-72 object-cover rounded-xl"
          />
        )}
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{eventVenue}</h3>
        <p className="text-gray-500 text-sm truncate">
          {city}, {country}
        </p>
        <span className="text-lg font-bold">
          ₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span>
        </span>
      </div>

      {typeof averageRating === "number" && (
        <div className="absolute bottom-14 right-2 flex bg-white px-2 py-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="gold"
            viewBox="0 0 24 24"
            stroke="gold"
            className="w-4 h-4 mr-1"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 1.401 8.168L12 18.896l-7.335 3.863 1.401-8.168L.132 9.209l8.2-1.191z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{averageRating.toFixed(1)}</span>
        </div>
      )}

      <div className="fixed z-[9999]">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Report Event</ModalHeader>
                <ModalBody>
                  <div className="flex flex-wrap gap-4">
                    {reasons.map((reason) => (
                      <Checkbox
                        key={reason}
                        isSelected={selectedReasons.includes(reason)}
                        onValueChange={() => handleCheckboxChange(reason)}
                      >
                        {reason}
                      </Checkbox>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleReportConfirm}
                    isDisabled={selectedReasons.length === 0}
                  >
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default EventCard;
