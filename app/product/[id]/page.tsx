"use client";
import Footer from "@/components/Footer";
import HomeProduct from "@/components/HomeProduct";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();

  const { products } = useAppContext();
  const [primaryImg, setPrimaryImg] = useState<any>(null);
  const [productData, setProductData] = useState<Product>();

  const handleFetchProductById = async () => {
    const product = products?.find((p) => {
      return p.id === id;
    });
    setProductData(product);
    setPrimaryImg(product?.image[0]);
  };

  useEffect(() => {
    handleFetchProductById();
  }, [id, products]);

  const handleSwitchImage = (index: number) => {
    setPrimaryImg(productData?.image[index]);
  };

  return (
    productData && (
      <>
        <Navbar />
        <main className="pt-14 space-y-10">
          <div className="app-container realtive">
            {/* product detail wrapper */}
            <div className="grid grid-cols-2 gap-16">
              {/* preview image */}
              <div className="px-5 lg:px-16 xl:px-20">
                <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                  <Image
                    className="w-full transition h-auto object-cover mix-blend-multiply"
                    src={primaryImg}
                    alt="primary-image"
                    width={1280}
                    height={720}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4 overflow-hidden rounded-md">
                  {productData.image.map((img, i) => (
                    <Image
                      onClick={() => handleSwitchImage(i)}
                      className="bg-gray-500/10 w-full h-auto object-cover cursor-pointer mix-blend-multiply"
                      key={i}
                      src={img}
                      alt={`img ${1}`}
                      width={1280}
                      height={720}
                    />
                  ))}
                </div>
              </div>

              {/* product details */}
              <div className="flex flex-col gap-4 md:gap-6">
                <h1 className="md:text-3xl text-2xl text-gray-800/90 font-medium">
                  {productData.name}
                </h1>
                <div className="flex items-center">
                  {[...new Array(5)].map((_, i) => (
                    <span key={i}>
                      <Star className="w-4 h-4 text-orange-600" />
                    </span>
                  ))}
                  <p className="text-gray-800/90 ml-2">(5)</p>
                </div>
                <p className="">{productData.description}</p>
                <h1 className="font-medium md:text-3xl text-2xl text-gray-800/90">
                  ${productData.offerPrice}
                  <span className="line-through ml-2 text-sm text-gray-800/90">
                    ${productData.price}
                  </span>
                </h1>

                <hr className="text-gray-300" />

                <table className="table-auto border-collapse max-w-72">
                  <tbody>
                    <tr>
                      <td className="text-gray-600 font-medium">Brand</td>
                      <td className="text-gray-800/90">Generic</td>
                    </tr>
                    <tr>
                      <td className="text-gray-600 font-medium">Color</td>
                      <td className="text-gray-800/90">Multi</td>
                    </tr>
                    <tr>
                      <td className="text-gray-600 font-medium">Category</td>
                      <td className="text-gray-800/90">
                        {productData.category}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex items-center space-x-2 *:rounded-md *:px-6 *:py-3 *:font-medium *:cursor-pointer">
                  <button className="bg-gray-500/10 text-gray-800/90">
                    Add to Cart
                  </button>
                  <button className="bg-orange-500 text-white">Buy now</button>
                </div>
              </div>
            </div>

            <div className="pb-14">
              <HomeProduct />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  );
};

export default ProductDetail;
