"use client";
import CreateProductModal from "@/components/CreateProductModal";
import Loading from "@/components/Loading";
import ProductTable from "@/components/ProductTable";
import SearchInput from "@/components/SearchInput";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductAdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategoies] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetchProduct = async () => {
    try {
      const response = await productService.getAll();
      if (response.success) {
        const existsCategory = response.data.map(
          (product) => product.categoryName
        );
        setCategoies([...new Set(existsCategory)]);
        setProducts(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const callbackFromCreateProductModal = () => {
    handleFetchProduct();
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

  const handleFilterByCategory = (category: string) => {
    const filtered = products.filter((product) => product.categoryName === category);
    setFilteredProducts(filtered);
  };

  const handleSearchByName = (name: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const fetchInitialProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getAll();
        if (response.success) {
          const existsCategory = response.data.map(
            (product) => product.categoryName
          );
          setCategoies([...new Set(existsCategory)]);
          setProducts(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialProducts();
  }, []);

  return (
    <section className="min-h-full">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-orange-600">Inventory</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Products</h1>
            <p className="mt-2 text-sm text-slate-500">Manage product catalog, pricing, discount, and stock levels.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Create product
          </button>
        </div>

        {/* top search and filtering */}
        <div className="flex flex-col gap-3 rounded-md bg-white p-4 md:flex-row md:items-center">
          <SearchInput onInputChange={handleSearchByName} />

          <select
            onChange={(e) => {
              if (!e.target.value) {
                setFilteredProducts([]);
                return;
              }
              handleFilterByCategory(e.target.value);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 md:w-56"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <ProductTable
            products={filteredProducts.length > 0 ? filteredProducts : products}
            handleDelete={handleDelete}
          />
        )}
      </div>

      {/* modal */}
      {isModalOpen && (
        <CreateProductModal
          calllbackFromCreateProductModal={callbackFromCreateProductModal}
          closeModal={() => setIsModalOpen(!isModalOpen)}
        />
      )}
    </section>
  );
};

export default ProductAdminPage;
