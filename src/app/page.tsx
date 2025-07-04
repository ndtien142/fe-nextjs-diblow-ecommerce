import React from "react";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/Footer";
import { StaticHomeSection, StreamingHomeSection } from "@/components/home";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="m-0 font-futura-book">
        {/* Streaming section with data fetching components */}
        <StreamingHomeSection />

        {/* Static section that renders immediately */}
        <div className="container md:px-16 lg:px-32">
          <StaticHomeSection />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
