import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white text-lg font-medium mb-4 relative">
              Company
              <span className="block w-12 h-0.5 bg-pink-500 mt-1"></span>
            </h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Our Services</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Affiliate Program</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-medium mb-4 relative">
              Get Help
              <span className="block w-12 h-0.5 bg-pink-500 mt-1"></span>
            </h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="#" className="hover:text-white transition">Order Status</a></li>
              <li><a href="#" className="hover:text-white transition">Payment Options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-medium mb-4 relative">
              Online Shop
              <span className="block w-12 h-0.5 bg-pink-500 mt-1"></span>
            </h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white transition">Watch</a></li>
              <li><a href="#" className="hover:text-white transition">Bag</a></li>
              <li><a href="#" className="hover:text-white transition">Shoes</a></li>
              <li><a href="#" className="hover:text-white transition">Dress</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-medium mb-4 relative">
              Follow Us
              <span className="block w-12 h-0.5 bg-pink-500 mt-1"></span>
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white hover:text-gray-900 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white hover:text-gray-900 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white hover:text-gray-900 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white hover:text-gray-900 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
