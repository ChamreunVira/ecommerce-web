import HeaderSlider from "@/components/HeaderSlider"
import Navbar from "@/components/Navbar"
import HomeProduct from "@/components/HomeProduct"
import Footer from "@/components/Footer"
import FeatureProduct from "@/components/FeatureProduct"
import Banner from "@/components/Banner"
import NewsLetter from "@/components/NewsLetter"

const page = () => {
  return (
    <>
      <Navbar/>
      <main className="app-container">
        <HeaderSlider/>
        <HomeProduct/>
        <FeatureProduct/>
        <Banner/>
        <NewsLetter/>
        <Footer/>
      </main>
    </>
  )
}

export default page