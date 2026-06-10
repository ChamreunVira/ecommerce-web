"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import { useState, useMemo, useRef, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const AllProduct = () => {
  const { products } = useAppContext();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const ref = useRef(null);

  const categories = useMemo(() => {
    const cats = new Set(products?.map((p: Product) => p.categoryName) || []);
    return Array.from(cats);
  }, [products]);

  const handleFilterProducts = async () => {
    try {
      const response = await productService.filterPrice(priceRange[0], priceRange[1]);
      if (response.success) {
        let filtered = response.data;

        if (selectedCategory) {
          filtered = filtered.filter(
            (product) => product.categoryName === selectedCategory
          );
        }

        if (searchTerm) {
          filtered = filtered.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setFilterProducts(filtered);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategory("");
    setSearchTerm("");
  };

  const handleFetchProduct = () => {
    if(filterProducts.length === 0) {
      setFilterProducts(products);
    }else {
      handleFilterProducts();
    }
  }

  useEffect(() => {
    const timer = setTimeout(handleFetchProduct, 500);
    return () => clearTimeout(timer);
  }, [priceRange, selectedCategory, searchTerm]);

  return (
    <>
      <Navbar handleToggleCartSidebar={() => {}} />
      <div className="px-6 md:px-8 lg:px-16 flex flex-col lg:flex-row gap-8 pb-14">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 pt-12">
          <div className="bg-white p-6 rounded-md border border-slate-300 sticky">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-700">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-4">Price Range</h4>
              <div className="space-y-4">
                {/* Range Slider Visual */}
                <div className="relative h-1.5 w-full rounded-full bg-orange-100">
                  <RangeSlider
                    ref={ref}
                    min={0}
                    max={1000}
                    value={priceRange}
                    onInput={setPriceRange}
                    id="slice-color"
                  />
                </div>

                {/* Price Display */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    ${priceRange[0]} - ${priceRange[1]}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategory === ""}
                      onChange={() => setSelectedCategory("")}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      All Categories
                    </span>
                  </label>
                  {(categories as string[]).map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() =>
                          setSelectedCategory(
                            selectedCategory === cat ? "" : cat
                          )
                        }
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col items-center mt-4">
            <h5 className="text-2xl font-medium">All Products</h5>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
            <p className="text-sm text-gray-500 mt-2">
              {filterProducts.length} products found
            </p>
          </div>
          <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14">
            {filterProducts.length > 0 ? (
              filterProducts.map((product: Product, i: number) => (
                <ProductCard key={i} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProduct;
