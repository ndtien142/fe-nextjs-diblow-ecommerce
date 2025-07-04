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
      </div>
      <Footer />
    </>
  );
};

export default Home;
