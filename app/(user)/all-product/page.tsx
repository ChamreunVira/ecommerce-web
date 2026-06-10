"use client";

import CartSidbar from "@/components/CartSidbar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/types/product";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const AllProduct = () => {
  const { products } = useAppContext();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [cartOpen, setCartOpen] = useState(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      counts.set(product.categoryName, (counts.get(product.categoryName) || 0) + 1);
    });

    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

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

    return filtered.sort((a, b) => {
      const priceA = a.price - a.price * (a.discount / 100);
      const priceB = b.price - b.price * (b.discount / 100);

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, priceRange, selectedCategory, searchTerm, sortBy]);

  const activeFilterCount =
    Number(Boolean(searchTerm.trim())) +
    Number(Boolean(selectedCategory)) +
    Number(priceRange[0] > 0 || priceRange[1] < 1000);

  const resetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategory("");
    setSearchTerm("");
    setSortBy("latest");
  };

  return (
    <>
      <Navbar handleToggleCartSidebar={() => setCartOpen(true)} />
      <CartSidbar open={cartOpen} setOpen={setCartOpen} />

      <main className="bg-white">
        <div className="app-container flex flex-col gap-7 py-7 lg:flex-row lg:items-start">
          <aside className="w-full lg:sticky lg:top-20 lg:w-72">
            <div className="max-h-none overflow-hidden rounded-md border border-slate-200 bg-white lg:max-h-[calc(100vh-6rem)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-orange-500">
                    <SlidersHorizontal size={24} />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
                    <p className="text-sm text-slate-500">
                      {activeFilterCount} active
                    </p>
                  </div>
                </div>

                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
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
                    className="mb-2 block text-base font-medium text-slate-500"
                  >
                    Sort
                  </label>
                  <select
                    id="product-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-orange-500"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </section>

                <section>
                  <label
                    htmlFor="product-search"
                    className="mb-2 block text-base font-medium text-slate-500"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="product-search"
                      type="search"
                      placeholder="Name, description, category"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="h-12 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-base text-slate-800 outline-none transition focus:border-orange-500"
                    />
                  </div>
                </section>

                <section className="border-t border-slate-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-medium text-slate-500">
                      Price range
                    </h3>
                    <span className="rounded-md px-2 py-0.5 text-sm font-semibold text-orange-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <RangeSlider
                    min={0}
                    max={1000}
                    value={priceRange}
                    onInput={(value) => setPriceRange(value as [number, number])}
                    id="product-price-range"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </section>

                <section className="border-t border-slate-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-medium text-slate-500">
                      Categories
                    </h3>
                    <span className="text-xs text-slate-400">
                      {categories.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className={`flex w-full items-center justify-between rounded-md border px-4 py-2 text-left text-sm transition ${
                        selectedCategory === ""
                          ? "text-orange-500"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>All products</span>
                      <span className="text-xs">{products.length}</span>
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setSelectedCategory(category.name)}
                        className={`flex w-full items-center justify-between rounded-md border px-4 py-2 text-left text-sm transition ${
                          selectedCategory === category.name
                            ? "text-orange-500"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
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
      <Footer />
    </>
  );
};

export default AllProduct;
