"use client";
import HeaderSlider from "@/components/HeaderSlider";
import Navbar from "@/components/Navbar";
import HomeProduct from "@/components/HomeProduct";
import Footer from "@/components/Footer";
import FeatureProduct from "@/components/FeatureProduct";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import CartSidbar from "@/components/CartSidbar";
import { useState } from "react";

const page = () => {

  const [open , setOpen] = useState<boolean>(true);

  const handleToggleCartSidebar = () => {
    setOpen(!open);
  }

  return (
    <>
      <Navbar handleToggleCartSidebar={handleToggleCartSidebar}/>
      <CartSidbar open={open} setOpen={handleToggleCartSidebar}/>
      <main className="app-container">
        <HeaderSlider />
        <HomeProduct />
        <FeatureProduct />
        <Banner />
        <NewsLetter />
        <Footer />
      </main>
    </>
  );
};

export default page;
