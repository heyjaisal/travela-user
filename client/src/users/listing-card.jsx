import { Link } from "react-router-dom";
import Slider from "react-slick";

const ListingCard = ({ listing, type }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const linkTo =
    type === "property" ? `/property/${listing._id}` : `/event/${listing._id}`;

  return (
    <Link to={linkTo}>
      <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg">
        <div className="overflow-hidden">
          {listing.images.length > 1 ? (
            <Slider {...settings} className="rounded-xl">
              {listing.images.map((img, index) => (
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
              src={listing.images[0]}
              alt="Property"
              className="w-full h-72 object-cover rounded-xl"
            />
          )}
        </div>

        <div className="mt-2 px-1">
          <h3 className="text-lg font-semibold truncate">
            {type === "property" ? listing.propertyType : listing.title}
          </h3>
          <p className="text-gray-500 text-sm truncate">
            {listing.city}, {listing.country}
          </p>
          <div className="flex justify-between items-center mt-1 relative">
            <span className="text-lg font-bold">
              ₹{type === "property" ? listing.price : listing.ticketPrice}/
              <span className="text-red-200 font-thin">
                {type === "property" ? "night" : "ticket"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
