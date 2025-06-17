import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HeroSection from "./HeroSection";
import PropertyList from "./listing";
import Faqs from "./Faqs";
import CardList from "./CardList";
import Testimonials from "./testimonials";
import Footer from "./footer";
import axiosInstance from "@/utils/axios-instance";

export default function App() {
  const [homepageContent, setHomepageContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        const res = await axiosInstance.get("/listing/homepage-content");
        setHomepageContent(res.data);
      } catch (err) {
        setError("Failed to load homepage content");
      }
    };
    fetchHomepageContent();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto pt-10 px-6">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="listing">
          <PropertyList />
        </section>

        {error && <p className="text-red-500">{error}</p>}
        {!homepageContent && !error && <p>Loading...</p>}

        {homepageContent && (
          <>
            <Faqs faqList={homepageContent.faqList} />
            <section id="blogs">
              <CardList cardItems={homepageContent.cardItems} />
            </section>
            <section id="features">
              <Testimonials testimonials={homepageContent.testimonialList} />
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
