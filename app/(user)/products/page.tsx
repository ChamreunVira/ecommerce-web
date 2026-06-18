"use client";

import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/product";
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const AllProduct = () => {
  const { products } = useAppContext();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      counts.set(
        product.categoryName,
        (counts.get(product.categoryName) || 0) + 1,
      );
    });
    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  // Up to 6 product name suggestions matching the current search term
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.trim().toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 6);
  }, [products, searchTerm]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const discountedPrice =
        product.price - product.price * (product.discount / 100);
      const matchesPrice =
        discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1];
      const matchesCategory =
        !selectedCategory || product.categoryName === selectedCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query);

      return matchesPrice && matchesCategory && matchesSearch;
    });

    // sort filter price by selected
    return filtered.sort((a, b) => {
      const priceA = a.price - a.price * (a.discount / 100);
      const priceB = b.price - b.price * (b.discount / 100);

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, priceRange, selectedCategory, searchTerm, sortBy]);

  //count all option filter
  const activeFilterCount =
    Number(Boolean(searchTerm.trim())) +
    Number(Boolean(selectedCategory)) +
    Number(priceRange[0] > 0 || priceRange[1] < 1000);

  // reset filter
  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategory("");
    setSearchTerm("");
    setSortBy("latest");
  };

  // Renders product name with the matching query portion bolded in orange
  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, index)}
        <span className="font-bold text-orange-600">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <>
      <main className="relative bg-white min-h-screen">
        <div className="app-container flex flex-col gap-7 py-7 lg:flex-row lg:items-start">
          {/* sidebar */}
          <aside className="w-full lg:sticky lg:w-100">
            {/* Mobile collapse toggle — hidden on lg+ */}
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 lg:hidden"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-500">
                  <SlidersHorizontal size={18} />
                </span>
                <span className="font-semibold text-slate-800">
                  {sidebarOpen ? "Hide Filters" : "Show Filters"}
                </span>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {sidebarOpen ? (
                <ChevronUp size={18} className="text-slate-400" />
              ) : (
                <ChevronDown size={18} className="text-slate-400" />
              )}
            </button>

            <div
              className={`${sidebarOpen ? "block" : "hidden"} lg:block mt-2 lg:mt-0 max-h-none overflow-hidden rounded-md border border-slate-200 bg-white lg:min-h-[calc(100vh-20rem)]`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-500">
                    <SlidersHorizontal size={24} />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Filters
                    </h2>
                    <p className="text-sm text-slate-500">
                      {activeFilterCount} active
                    </p>
                  </div>
                </div>

                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                  >
                    <X size={15} />
                    Reset
                  </button>
                ) : null}
              </div>

              <div className="max-h-none space-y-4 overflow-y-visible p-4 lg:max-h-[calc(100vh-10.25rem)] lg:overflow-y-auto">
                <section>
                  <label
                    htmlFor="product-sort"
                    className="mb-2 block text-base font-medium text-slate-800"
                  >
                    Sort
                  </label>
                  <select
                    id="product-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-orange-500"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </section>

                <section className="border-t border-slate-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-medium text-slate-800">
                      Price range
                    </h3>
                    <span className="rounded-md px-2 py-0.5 text-sm font-semibold text-emerald-500">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <RangeSlider
                    min={0}
                    max={1000}
                    value={priceRange}
                    onInput={(value) =>
                      setPriceRange(value as [number, number])
                    }
                    id="product-price-range"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </section>

                <section className="border-t border-slate-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-medium text-slate-800">
                      Categories
                    </h3>
                    <span className="text-xs text-slate-400">
                      {categories.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className={`flex w-fit font-semibold items-center justify-between rounded-md border px-4 py-2 text-left text-sm transition ${
                        selectedCategory === ""
                          ? "text-white bg-orange-500"
                          : "border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>All products</span>
                      <span className="ml-3 text-xs">{products.length}</span>
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setSelectedCategory(category.name)}
                        className={`flex w-fit font-semibold items-center justify-between rounded-md border px-4 py-2 text-left text-sm transition ${
                          selectedCategory === category.name
                            ? "text-white bg-orange-500"
                            : "border-slate-200 bg-slate-100/50 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">{category.name}</span>
                        <span className="ml-3 text-xs">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-5 border-b border-slate-200 pb-5">
              {/* Page title row */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-medium text-orange-600">Shop</p>
                  <h1 className="mt-1 text-2xl font-semibold text-slate-950">
                    All Products
                  </h1>
                </div>
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredProducts.length}
                  </span>{" "}
                  of {products.length} products
                </p>
              </div>

              {/* Prominent search bar */}
              <div ref={searchContainerRef} className="relative mt-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="product-search"
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowSuggestions(true);
                  }}
                  className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-12 text-base text-slate-800 outline-none transition focus:border-orange-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setShowSuggestions(false);
                    }}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Suggestions dropdown */}
                {isFocused && showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        // onMouseDown fires before the input's onBlur so the click registers
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchTerm(product.name);
                          setShowSuggestions(false);
                          setIsFocused(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-orange-50"
                      >
                        <span className="text-slate-800">
                          {highlightMatch(product.name, searchTerm.trim())}
                        </span>
                        <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          {product.categoryName}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active filter chips (category & price — search chip is the input itself) */}
              {(selectedCategory ||
                priceRange[0] > 0 ||
                priceRange[1] < 1000) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      Category: {selectedCategory}
                      <button
                        type="button"
                        onClick={() => setSelectedCategory("")}
                        aria-label="Remove category filter"
                        className="flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-orange-200"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      Price: ${priceRange[0]} – ${priceRange[1]}
                      <button
                        type="button"
                        onClick={() => setPriceRange([0, 1000])}
                        aria-label="Remove price filter"
                        className="flex h-4 w-4 items-center justify-center rounded-full transition hover:bg-orange-200"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid w-full grid-cols-2 gap-5 pb-14 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-slate-200 bg-white px-6 py-16 text-center">
                <p className="text-base font-semibold text-slate-800">
                  No products found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try removing a filter or searching another product name.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default AllProduct;
