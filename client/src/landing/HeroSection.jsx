import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Discover & Book
        <span className="bg-gradient-to-r from-blue-200 to-pink-600 text-transparent bg-clip-text">
          {" "}
          Amazing Stays & Events
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Find the perfect place to stay and exciting events to attend. Share your
        experiences through blogs and explore insights from fellow travelers.
      </p>
    </div>
  );
};

export default HeroSection;
