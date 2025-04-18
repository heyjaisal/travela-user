import ImageGallery from "@/components/image";
import MapWithDirectionButton from "@/components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function PropertyPage() {
  const { locale } = useLocale();
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);
  const [disabledRanges, setDisabledRanges] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [guests, setGuests] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/details/${id}`, {
          params: { type: "property" },
          withCredentials: true,
        });
        setProperty(data.item);
        if (data.item.bookedDates && data.item.bookedDates.length > 0) {
          const ranges = data.item.bookedDates.map((booking) => {
            const startDate = parseDate(booking.checkIn);
            const endDate = parseDate(booking.checkOut);
            return [startDate, endDate];
          });
          setDisabledRanges(ranges);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const isDateUnavailable = (date) => {
    const todayDate = today(getLocalTimeZone());
    const isPast = date.compare(todayDate) < 0;
    return isPast || disabledRanges.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );
  };

  const getNumberOfNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = checkOut - checkIn;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days === 0 ? 1 : days;
  };

  const isReserveDisabled =
    !checkIn || !checkOut || !guests || guests <= 0 || guests > property?.maxGuests;

  const handleDateSelect = (date) => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    if (showCalendar === "checkin") {
      setCheckIn(jsDate);
    } else {
      setCheckOut(jsDate);
    }
    setShowCalendar(null);
  };

  const handleReserve = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }
    if (guests > property.maxGuests) {
      toast.error(`Only ${property.maxGuests} guests allowed for this property.`);
      return;
    }
    setLoading(true);
    try {
      if (!property.host || !property.host._id) {
        throw new Error("Host information is missing");
      }
      const response = await axiosInstance.post("/checkout/property", {
        propertyId: id,
        title: property.title,
        location: `${property.city}, ${property.state}, ${property.country}`,
        image: property.images?.[0] || "",
        hostId: property.host?._id,
        date: property.eventDateTime,
        checkIn,
        checkOut,
        price: property.price,
        hostName: `${property.host?.firstName} ${property.host?.lastName}`,
        hostStripeAccount: property.host?.stripeAccountId,
        guests,
      });
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Invalid response from server");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to create checkout session");
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  if (!property) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {property.title || "Property Details"}
        </h2>
        <ImageGallery images={property.images || []} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{property.price}
            <span className="text-sm font-normal">/night</span>
          </h2>
          <p className="text-sm text-gray-600">Availability: Available</p>
          <div className="border p-3 rounded-lg my-4">
            <div className="flex justify-between">
              <div onClick={() => setShowCalendar("checkin")} className="cursor-pointer">
                <p className="text-sm text-gray-600">CHECK-IN</p>
                <p className="font-normal">
                  {checkIn ? checkIn.toDateString() : "Select Date"}
                </p>
              </div>
              <div onClick={() => setShowCalendar("checkout")} className="cursor-pointer">
                <p className="text-sm text-gray-600">CHECKOUT</p>
                <p className="font-normal">
                  {checkOut ? checkOut.toDateString() : "Select Date"}
                </p>
              </div>
            </div>
          </div>
          {showCalendar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowCalendar(null);
              }}
            >
              <div
                className="bg-white p-4 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Calendar
                  aria-label="Date Selection"
                  isDateUnavailable={isDateUnavailable}
                  onChange={handleDateSelect}
                />
              </div>
            </div>
          )}
          {checkIn && checkOut && (
            <div className="my-4">
              <h3 className="text-xl font-semibold">
                Total Price: ₹{property.price * getNumberOfNights()}
              </h3>
              <p className="text-sm text-gray-600">
                Total: ₹{property.price * getNumberOfNights()} for {getNumberOfNights()} night
                {getNumberOfNights() > 1 ? "s" : ""}
              </p>
            </div>
          )}
          <div className="mb-3">
            <h1>Max Guests: {property.maxStay}</h1>
            <Input
              placeholder="Add Guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          <button
            onClick={handleReserve}
            disabled={isReserveDisabled || loading}
            className="w-full bg-button text-white py-2 rounded-lg font-semibold disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : "Reserve"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            You won't be charged yet
          </p>
        </div>

        <div className="md:col-span-2 space-y-4 order-2 md:order-1">
          <h1 className="text-2xl font-bold">
            Barn in {property.state}, {property.country}
          </h1>
          <p className="text-gray-600">
            {property.maxStay} guests · {property.bedrooms} bedrooms ·{" "}
            {property.kitchen} Kitchen · {property.bathrooms} bathrooms
          </p>
          <p className="text-gray-700">
            Location: {property.city}, {property.state}, {property.country}
          </p>
          <Link
            to={`/host/${property?.host?._id}`}
            className="border-t pt-4 flex items-center gap-3"
          >
            <Avatar>
              <AvatarImage src={property.host?.image} alt="Host Avatar" />
              <AvatarFallback>
                {property.host?.username
                  ? property.host.username.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                Hosted by {property?.host?.firstName || "Unknown"}{" "}
                {property?.host?.lastName || ""}
              </h3>
              <p className="text-sm text-gray-500">
                3 years hosting · Verified Host
              </p>
            </div>
          </Link>
          <p className="py-5">{property.description}</p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {property.features && property.features.length > 0 ? (
              property.features.map((feature) => (
                <li key={feature._id}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>
          <h3 className="text-xl font-bold">Where you'll be</h3>
          <p>
            {property.street}, {property.city}, {property.state}, {property.country}
          </p>
          <MapWithDirectionButton
            lat={property.location?.lat}
            lng={property.location?.lng}
          />
        </div>
      </div>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Login Required</h2>
          <p className="text-gray-600">Please log in with Google to reserve this property.</p>
          <Button onClick={handleGoogleSignup} className="w-full bg-button text-white">
            Continue with Google
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PropertyPage;
