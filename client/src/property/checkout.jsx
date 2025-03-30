import React from "react";
import { FileText, Trash2, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

const coupons = [
  { value: "Store Coupons" },
  { value: "BusinessName Coupon" },
];

const orders = [
  {
    seller: "NIDIN Factory Online Store",
    img: "https://cdn.easyfrontend.com/pictures/portfolio/portfolio16.jpg",
    title:
      "PD-04 Carbon Fiber Insole Poron Plantar Fasciitis Arch Support Flat Feet Orthopedic Insoles Custom Orthotics",
    color: "black",
    country: "China",
    bdPrice: "6,638.89",
    subTotal: "6,638.89",
    shipping: "0.00",
    total: "6,638.89",
  },
  {
    seller: "NIDIN Factory Online Store",
    img: "https://cdn.easyfrontend.com/pictures/portfolio/portfolio12.jpg",
    title:
      "Factory Direct Queendom Certipur-Us Luxury Comfortable Sell Top Spring Bed 'Matress' Hotel Mattress Springs",
    color: "Gray ",
    country: "Russia",
    bdPrice: "6,638.89",
    subTotal: "6,638.89",
    shipping: "0.00",
    total: "6,638.89",
  },
];

const CouponItem = ({ coupon }) => (
  <div className="text-sm flex justify-between items-center mb-1">
    <span className="opacity-75">
      <FileText className="inline-block mr-2 text-blue-600" size={16} />
      {coupon.value}
    </span>
    <span>
      <a href="#!" className="text-blue-600 hover:underline">
        View <ChevronDown className="inline-block ml-1" size={16} />
      </a>
    </span>
  </div>
);

CouponItem.propTypes = {
  coupon: PropTypes.object.isRequired,
};

const PromoCode = () => (
  <div className="mt-3">
    <p className="text-sm mb-1">Promo Code</p>
    <div className="flex h-10">
      <input
        type="text"
        className="bg-blue-100 dark:bg-slate-700 border-none focus:outline-none h-full flex-grow rounded-md p-3 mr-2"
        placeholder="Recipient's username"
      />
      <button
        className="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 px-4 py-2 leading-none h-full rounded-md"
        type="button"
      >
        Apply
      </button>
    </div>
  </div>
);

const SideBar = () => {
  return (
    <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 md:p-6">
      <h6 className="text-2xl font-bold mb-6">Order Summary</h6>

      {coupons.map((coupon, i) => (
        <CouponItem coupon={coupon} key={i} />
      ))}

      <PromoCode />

      <hr className="dark:border-slate-700 my-6" />
      <div className="flex justify-between items-center">
        <span className="font-bold">Total</span>
        <span className="text-2xl font-bold">US $1231.00</span>
      </div>
      <p className="text-sm text-end opacity-50">Approximately BDT 94,856.76</p>

      <button className="bg-blue-600 text-white hover:bg-opacity-90 w-full rounded-md py-3 px-4 mt-6">
        Place Order
      </button>
    </div>
  );
};

const Quantity = () => {
  return (
    <div className="h-10 border dark:border-slate-700 rounded-full flex w-36 relative mt-4 overflow-hidden">
      <button
        className="px-4 py-1 font-bold inline-flex justify-center border-r dark:border-slate-700 text-blue-600 hover:bg-blue-600 hover:bg-opacity-10"
        type="button"
      >
        -
      </button>
      <input
        type="number"
        className="px-4 pl-5 font-bold py-1 inline-flex justify-center max-w-[60px] text-center bg-transparent focus:outline-none"
        value="2"
      />
      <button
        className="px-4 py-1 font-bold inline-flex justify-center border-l dark:border-slate-700 text-blue-600 hover:bg-blue-600 hover:bg-opacity-10"
        type="button"
      >
        +
      </button>
    </div>
  );
};

const OrderItem = ({ item, index }) => {
  return (
    <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 md:p-6 mb-4">
      <div className="flex justify-between text-sm">
        <p>
          Package {index + 1} of {orders.length}
        </p>
        <p>
          Shipped by <b>Md. Parves Hossain</b>
        </p>
      </div>
      <hr className="dark:border-slate-700 my-4" />
      <div className="flex flex-col sm:flex-row">
        <div className="w-32 sm:mr-4 mx-auto">
          <a href="#!">
            <img src={item.img} alt="" className="w-full h-auto rounded" />
          </a>
        </div>
        <div>
          <div className="text-lg font-medium text-blue-600 mb-1">
            <a href="#!">{item.title}</a>
          </div>
          <p className="text-sm mb-2">
            <span className="mr-3">
              <b>Color</b>: {item.color}
            </span>
            <span>
              <b>Ships From</b>: {item.country}
            </span>
          </p>
          <div className="mb-2">
            <span className="text-xl text-blue-600 font-bold mr-2">
              Rs. {item.bdPrice}
            </span>
            <Quantity />
          </div>
        </div>
        <div className="w-full md:w-auto">
          <button className="w-10 h-10 text-blue-600 hover:bg-blue-200 dark:bg-opacity-20 inline-flex justify-center items-center rounded-full">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <hr className="dark:border-slate-700 my-4" />
      <div className="flex justify-end">
        <div className="w-[300px]">
          <div className="text-sm opacity-50 flex justify-between items-center mb-1">
            <span>Subtotal</span>
            <span>BDT {item.subTotal}</span>
          </div>
          <div className="text-sm flex justify-between items-center mb-1">
            <span className="opacity-75">
              <FileText className="mr-2 text-blue-600" size={16} />
              Store Coupons
            </span>
            <span>
              <a href="#!" className="text-blue-600 hover:underline">
                View <ChevronDown className="ml-1" size={16} />
              </a>
            </span>
          </div>
          <div className="text-sm flex justify-between items-center opacity-50 mb-1">
            <span>Shipping</span>
            <span>BDT {item.shipping}</span>
          </div>
          <div className="text-sm font-bold flex justify-between items-center">
            <span>Total</span>
            <span>BDT {item.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const Epcheckout5 = () => {
  return (
    <section className="max-w-6xl mx-auto p-5 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="w-full lg:w-2/3">
            {orders.map((item, i) => (
              <OrderItem item={item} index={i} key={i} />
            ))}
          </div>
          <div className="w-full lg:w-1/3">
            <SideBar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Epcheckout5;
