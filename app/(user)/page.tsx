"use client";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProduct from "@/components/HomeProduct";
import FeatureProduct from "@/components/FeatureProduct";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";

const page = () => {


  return (
    <>
      <main className="app-container">
        <HeaderSlider />
        <HomeProduct />
        <FeatureProduct />
        <Banner />
        <NewsLetter />
      </main>
    </>
  );
};

export default page;
