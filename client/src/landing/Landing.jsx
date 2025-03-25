import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import HeroSection from "./HeroSection";
import PropertyList from "./Pricing";
import Workflow from "./Workflow";
import FeatureSection from "./FeatureSection";

export default function App() {

  return (
    <>
      <div className="max-w-7xl mx-auto pt-10 px-6">
        <section id="hero">
          <HeroSection />
        </section>
        <section id="listing">
          <PropertyList />
        </section>
        <section id="blogs">
          <Workflow />
        </section>
        <section id="features">
          <FeatureSection />
        </section>
        <section id="aboutus"></section>
      </div>
    </>
  );
}
