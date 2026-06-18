"use client";
import Loading from "@/components/Loading";
import ProductTable from "@/components/ProductTable";
import SearchInput from "@/components/SearchInput";
import UpdateProductModal from "@/components/UpdateProductModal";
import { useAppContext } from "@/context/AppContext";
import { productService } from "@/services/product-service";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { ChevronRight, Home, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAll();
      if (response.success) {
        const names = [...new Set(response.data.map((p) => p.categoryName))];
        setCategoryNames(names);
        setProducts(response.data);
        setFilteredProducts([]);
        setCategoryFilter("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await productService.delete(id);
      if (response.success) {
        toast.success("Product deleted successfully");
        handleFetchProduct();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchByName = (name: string) => {
    const q = name.toLowerCase();
    setFilteredProducts(
      name.trim()
        ? products.filter((p) => p.name.toLowerCase().includes(q))
        : [],
    );
  };

  const handleFilterByCategory = (cat: string) => {
    setCategoryFilter(cat);
    setFilteredProducts(
      cat ? products.filter((p) => p.categoryName === cat) : [],
    );
  };

  useEffect(() => {
    if (!sessionReady) return;
    handleFetchProduct();
  }, [sessionReady]);

  const displayed =
    filteredProducts.length > 0 || categoryFilter ? filteredProducts : products;

  const inStock = products.filter((p) => p.qty > 0).length;
  const lowStock = products.filter((p) => p.qty > 0 && p.qty < 10).length;
  const outOfStock = products.filter((p) => p.qty <= 0).length;

  const statCards = [
    {
      label: "Total Products",
      value: products.length,
      color: "text-slate-900",
    },
    { label: "In Stock", value: inStock, color: "text-emerald-600" },
    { label: "Low Stock", value: lowStock, color: "text-amber-600" },
    { label: "Out of Stock", value: outOfStock, color: "text-rose-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 hover:text-slate-800 transition-colors"
        >
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Products List</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Products List
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage product catalog, pricing, discount, and stock levels.
          </p>
        </div>
        <Link
          href="/admin/product/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput onInputChange={handleSearchByName} />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => handleFilterByCategory(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500"
        >
          <option value="">All Categories</option>
          {categoryNames.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <ProductTable
          products={displayed}
          handleDelete={handleDelete}
          handleUpdate={setEditProduct}
        />
      )}

      {editProduct && (
        <UpdateProductModal
          categories={categories}
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={handleFetchProduct}
        />
      )}
    </div>
  );
};

export default ProductAdminPage;
