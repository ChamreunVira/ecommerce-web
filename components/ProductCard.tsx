"use client";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/product";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
  const { router, handleAddProductToCart } = useAppContext();

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAdd = async () => {
    try {
      await handleAddProductToCart(product.id);
      toast.success(`"${product.name}" added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="group flex flex-col rounded-md border border-gray-100 bg-white transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div
        className="relative cursor-pointer overflow-hidden bg-gray-50"
        style={{ aspectRatio: "1 / 1" }}
        onClick={() => router.push(`/product/${product.id}`)}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/${product.images[0]}`}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-0.5 text-[0.7rem] font-bold text-white shadow">
            -{product.discount}%
          </span>
        )}
        {product.qty <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="rounded-full bg-gray-800/80 px-3 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h5
          onClick={() => router.push(`/product/${product.id}`)}
          className="cursor-pointer line-clamp-2 text-sm font-semibold text-gray-800 leading-snug hover:text-orange-600 transition-colors"
        >
          {product.name}
        </h5>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
          ))}
          <span className="ml-1 text-[0.7rem] text-gray-400">(5.0)</span>
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            disabled={product.qty <= 0}
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-lg border border-orange-500 bg-orange-50 px-3 py-1.5 text-[0.75rem] font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
