"use client";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/product";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
  const { router, handleAddProductToCart } = useAppContext();

  return (
    <div className="relative max-w-50">
      <div className="absolute right-2 top-2 z-1 p-1.5 bg-white shadow-sm rounded-full group">
        <Heart className="w-4 h-4 text-gray-600 group-hover:text-rose-500 cursor-pointer" />
      </div>
      <div className="bg-gray-500/10 rounded-md group">
        <Image
          onClick={() => { router.push(`/product/${product.id}`) }}
          className="cover group-hover:scale-110 transition-transform duration-300"
          src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/${product.images[0]}`}
          alt={product.name}
          width={800}
          height={800}
          unoptimized
        />
      </div>
      <div>
        <h5 className="text-[0.9rem] font-medium text-gray-900 leading-loose">
          {product.name}
        </h5>
        <div>
          <p className="truncate text-gray-500 text-xs">
            {product.description}
          </p>
          <div>
            <span className="text-[0.85rem] text-gray-500">5</span>
            <div className="inline-flex ml-2 items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  <Star className="w-3 h-3 text-orange-600" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <h5 className="font-medium text-[0.9rem]">${product.price}</h5>
          <button
            disabled={product.qty === 0}
            onClick={() => handleAddProductToCart(product.id)}
            className={`text-[0.8rem] flex gap-2 rounded-lg px-3 py-1 border cursor-pointer ${product.qty <= 0 ? 'border-amber-500 text-amber-500' : 'border-gray-300 hover:bg-gray-100 text-gray-900'}`}>
            <ShoppingCart className="w-4 h-4" /> {product.qty <= 0 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
