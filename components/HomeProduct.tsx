"use client";

import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/product";
import {
  Filter,
  LayoutGrid,
  LayoutList,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

type ViewCols = 2 | 3 | 4 | 5 | 1;

const gridColsMap: Record<ViewCols, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  1: "grid-cols-1",
};

const Icon2Col = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
    <rect x="1" y="1" width="8" height="8" rx="1.5" />
    <rect x="11" y="1" width="8" height="8" rx="1.5" />
    <rect x="1" y="11" width="8" height="8" rx="1.5" />
    <rect x="11" y="11" width="8" height="8" rx="1.5" />
  </svg>
);

const Icon3Col = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
    <rect x="1" y="1" width="5" height="8" rx="1.2" />
    <rect x="7.5" y="1" width="5" height="8" rx="1.2" />
    <rect x="14" y="1" width="5" height="8" rx="1.2" />
    <rect x="1" y="11" width="5" height="8" rx="1.2" />
    <rect x="7.5" y="11" width="5" height="8" rx="1.2" />
    <rect x="14" y="11" width="5" height="8" rx="1.2" />
  </svg>
);

const Icon4Col = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
    <rect x="1" y="1" width="3.5" height="8" rx="1" />
    <rect x="5.5" y="1" width="3.5" height="8" rx="1" />
    <rect x="11" y="1" width="3.5" height="8" rx="1" />
    <rect x="15.5" y="1" width="3.5" height="8" rx="1" />
    <rect x="1" y="11" width="3.5" height="8" rx="1" />
    <rect x="5.5" y="11" width="3.5" height="8" rx="1" />
    <rect x="11" y="11" width="3.5" height="8" rx="1" />
    <rect x="15.5" y="11" width="3.5" height="8" rx="1" />
  </svg>
);

const Icon5Col = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
    <rect x="0.5" y="1" width="2.8" height="8" rx="0.8" />
    <rect x="4.3" y="1" width="2.8" height="8" rx="0.8" />
    <rect x="8.6" y="1" width="2.8" height="8" rx="0.8" />
    <rect x="12.9" y="1" width="2.8" height="8" rx="0.8" />
    <rect x="16.7" y="1" width="2.8" height="8" rx="0.8" />
    <rect x="0.5" y="11" width="2.8" height="8" rx="0.8" />
    <rect x="4.3" y="11" width="2.8" height="8" rx="0.8" />
    <rect x="8.6" y="11" width="2.8" height="8" rx="0.8" />
    <rect x="12.9" y="11" width="2.8" height="8" rx="0.8" />
    <rect x="16.7" y="11" width="2.8" height="8" rx="0.8" />
  </svg>
);

const HomeProduct = () => {
  const { categories, products, router } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("name");
  const [stockStatus, setStockStatus] = useState("all");
  const [quality, setQuality] = useState("all");

  const [viewCols, setViewCols] = useState<ViewCols>(4);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 1000]);
    setSortBy("name");
    setStockStatus("all");
    setQuality("all");
  };

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) =>
      counts.set(p.categoryName, (counts.get(p.categoryName) || 0) + 1)
    );
    return counts;
  }, [products]);

  const displayedProducts = useMemo(() => {
    const list = products.filter((p) => {
      const dp = p.price * (1 - p.discount / 100);
      if (dp < priceRange[0] || dp > priceRange[1]) return false;
      if (selectedCategory && p.categoryName !== selectedCategory) return false;
      if (stockStatus === "in-stock" && p.qty <= 0) return false;
      if (stockStatus === "out-of-stock" && p.qty > 0) return false;
      if (quality === "discounted" && p.discount <= 0) return false;
      return true;
    });

    list.sort((a, b) => {
      const dpA = a.price * (1 - a.discount / 100);
      const dpB = b.price * (1 - b.discount / 100);
      if (sortBy === "price-low") return dpA - dpB;
      if (sortBy === "price-high") return dpB - dpA;
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "latest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.name.localeCompare(b.name);
    });

    const hasActiveFilter =
      selectedCategory ||
      priceRange[0] > 0 ||
      priceRange[1] < 1000 ||
      stockStatus !== "all" ||
      quality !== "all";
    return hasActiveFilter ? list : list.slice(0, 10);
  }, [products, selectedCategory, priceRange, sortBy, stockStatus, quality]);

  const viewButtons: { cols: ViewCols; icon: React.ReactNode; label: string }[] = [
    { cols: 2, icon: <Icon2Col />, label: "2-column grid" },
    { cols: 3, icon: <Icon3Col />, label: "3-column grid" },
    { cols: 4, icon: <Icon4Col />, label: "4-column grid" },
    { cols: 5, icon: <Icon5Col />, label: "5-column grid" },
    { cols: 1, icon: <LayoutList className="h-4 w-4" />, label: "List view" },
  ];

  return (
    <>
      {/* Orange range-slider theme */}
      <style>{`
        .hp-orange-slider .range-slider__range { background: #f97316; }
        .hp-orange-slider .range-slider__thumb { background: #f97316; border: 2px solid #fff; box-shadow: 0 0 0 2px #f97316; }
      `}</style>

      <div className="flex flex-col items-center pt-14">

        <div className="w-full mb-6 flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
            Discover
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
        </div>

        <div className="w-full mb-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === ""
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            All Products
            <span className="ml-1.5 opacity-70 text-xs">({products.length})</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat.name
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {cat.name}
              <span className="ml-1.5 opacity-70 text-xs">
                ({categoryCounts.get(cat.name) ?? 0})
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => { setSelectedCategory(""); router.push("/products"); }}
            className="ml-auto px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-all"
          >
            See all →
          </button>
        </div>

        <div className="w-full mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          {/* View toggle */}
          <span className="text-sm font-medium text-gray-600 mr-1">View:</span>
          <div className="flex items-center gap-1">
            {viewButtons.map(({ cols, icon, label }) => (
              <button
                key={cols}
                type="button"
                aria-label={label}
                onClick={() => setViewCols(cols)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  viewCols === cols
                    ? "bg-orange-500 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Filters toggle */}
          <button
            type="button"
            onClick={() => setFiltersOpen((p) => !p)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
              filtersOpen
                ? "bg-orange-500 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Right: sort + product count */}
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="name">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="latest">Latest</option>
            </select>
            <span className="whitespace-nowrap rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {displayedProducts.length} products
            </span>
          </div>
        </div>

        {filtersOpen && (
          <div className="w-full mb-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-base font-bold text-gray-900">🎯 Advanced Filters</h3>
              <p className="mt-0.5 text-sm text-gray-500">
                Fine-tune your search to find exactly what you&apos;re looking for
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Price Range */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-gray-800">💰 Price Range</h4>
                <div className="hp-orange-slider">
                  <RangeSlider
                    min={0}
                    max={1000}
                    value={priceRange}
                    onInput={(v) => setPriceRange(v as [number, number])}
                    id="hp-price-range"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-orange-500"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={1000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-orange-500"
                    placeholder="Max"
                  />
                </div>
                <span className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  ${priceRange[0]} – ${priceRange[1]}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-gray-800">📦 Stock Status</h4>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Product Quality */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-gray-800">🏆 Product Quality</h4>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="all">All Products</option>
                  <option value="top-rated">Top Rated</option>
                  <option value="discounted">On Sale</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-gray-800">⚡ Quick Actions</h4>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  Apply Filters ({displayedProducts.length})
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {displayedProducts.length > 0 ? (
          <div className={`w-full grid gap-8 pb-10 ${gridColsMap[viewCols]}`}>
            {displayedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="w-full rounded-xl border border-gray-100 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-400">
              <LayoutGrid className="h-7 w-7" />
            </div>
            <p className="text-base font-semibold text-gray-800">No products found</p>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Clear filters
            </button>
          </div>
        )}

        <button
          onClick={() => router.push("/products")}
          className="mt-4 mb-4 rounded-full cursor-pointer border border-orange-200 bg-orange-50 px-12 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-500 hover:text-white hover:border-orange-500"
        >
          See more products →
        </button>
      </div>
    </>
  );
};

export default HomeProduct;