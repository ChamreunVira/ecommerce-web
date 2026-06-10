"use client";

import CartSidbar from "@/components/CartSidbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import { Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, router, handleAddProductToCart } = useAppContext();
  const [primaryImg, setPrimaryImg] = useState<string | null>(null);
  const [productData, setProductData] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const fetchProductById = async () => {
      try {
        const response = await productService.getById(Number(id));
        if (response.success && isCurrent) {
          setProductData(response.data);
          setPrimaryImg(response.data.images[0] || null);
          setQuantity(1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductById();

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!productData) return [];

    return products
      .filter(
        (product) =>
          product.categoryName === productData.categoryName &&
          product.id !== productData.id
      )
      .slice(0, 5);
  }, [productData, products]);

  const finalPrice = productData
    ? productData.price - productData.price * (productData.discount / 100)
    : 0;

  const handleSwitchImage = (index: number) => {
    setPrimaryImg(productData?.images[index] || null);
  };

  const handleAddToCart = async () => {
    if (!productData) return;
    await handleAddProductToCart(productData.id, quantity);
    setCartOpen(true);
  };

  if (!productData) {
    return null;
  }

  return (
    <>
      <Navbar handleToggleCartSidebar={() => setCartOpen(true)} />
      <CartSidbar open={cartOpen} setOpen={setCartOpen} />

      <main className="bg-white">
        <section className="app-container py-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,520px)_minmax(360px,1fr)] lg:gap-12">
            <div className="w-full max-w-[520px]">
              <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                {primaryImg ? (
                  <Image
                    className="aspect-[4/3] w-full object-contain p-5 mix-blend-multiply"
                    src={`http://localhost:8080/api/v1/uploads/${primaryImg}`}
                    alt={productData.name}
                    width={720}
                    height={540}
                    unoptimized
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {productData.images.map((img, index) => {
                  const isSelected = img === primaryImg;

                  return (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => handleSwitchImage(index)}
                      className={`overflow-hidden rounded-md border bg-slate-50 transition ${
                        isSelected
                          ? "border-orange-500"
                          : "border-slate-200 hover:border-orange-200"
                      }`}
                    >
                      <Image
                        className="aspect-square w-full object-contain p-2 mix-blend-multiply"
                        src={`http://localhost:8080/api/v1/uploads/${img}`}
                        alt={`${productData.name} ${index + 1}`}
                        width={220}
                        height={220}
                        unoptimized
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-orange-600">
                {productData.categoryName}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                {productData.name}
              </h1>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500">(5)</span>
              </div>

              <p className="mt-5 leading-7 text-slate-600">
                {productData.description}
              </p>

              <div className="mt-6 flex items-end gap-3">
                <p className="text-3xl font-semibold text-slate-950">
                  ${finalPrice.toFixed(2)}
                </p>
                {productData.discount > 0 ? (
                  <p className="pb-1 text-sm text-slate-400 line-through">
                    ${productData.price.toFixed(2)}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 rounded-md border border-slate-200 bg-white p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Brand</span>
                  <span className="font-medium text-slate-800">Generic</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Color</span>
                  <span className="font-medium text-slate-800">Multi</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Available stock</span>
                  <span className="font-medium text-slate-800">
                    {productData.qty}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 w-full items-center justify-between rounded-md border border-slate-200 bg-white sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity === 1}
                    className="flex h-full w-12 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(productData.qty || current + 1, current + 1)
                      )
                    }
                    className="flex h-full w-12 items-center justify-center text-slate-500 hover:bg-slate-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-12 flex-1 rounded-md border border-orange-500 bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Add to cart
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/cart")}
                  className="h-12 flex-1 rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>

          <section className="mx-auto mt-14 max-w-6xl border-t border-slate-200 pt-8">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Related category
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  More in {productData.categoryName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => router.push("/all-product")}
                className="self-start rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:self-auto"
              >
                View all products
              </button>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
                No other products in this category yet.
              </div>
            )}
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetail;
