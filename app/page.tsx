import HeaderSlider from "@/components/HeaderSlider"
import Navbar from "@/components/Navbar"
import AllProduct from "./all-product/page"

const page = () => {
  return (
    <>
      <Navbar/>
      <main className="app-container">
        <HeaderSlider/>
        <AllProduct/>
      </main>
    </>
  )
}

export default page