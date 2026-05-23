"use client";
import CreateProductModal from "@/components/CreateProductModal";
import ProductTable from "@/components/ProductTable";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import { Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductAdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategoies] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    } catch (e: any) {
      console.log(e.message);
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
    } catch (e: any) {
      console.log(e.message);
    }
  }

  const handleFilterByCategory = (category: string) => {
    const filtered = products.filter((product) => product.categoryName === category);
    setFilteredProducts(filtered);
  };

  const handleSearchByName = (name: string) => {
    const filtered = products.filter((product) => product.name.toLowerCase().includes(name.toLowerCase()));
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleFetchProduct();
    return () => new AbortController().abort();
  }, []);

  return (
    <section className="relative h-full overflow-x-hidden p-12">

      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="flex items-center text-2xl text-gray-800 font-medium leading-12">
            <button className="mr-2">
              <ShoppingBag />
            </button>
            Product
          </h1>
          <p className="text-base text-gray-500/90">Product management</p>
        </div>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="flex items-center px-6 py-2 bg-orange-500 rounded-md text-white"
        >
          <span className="mr-2">
            <Plus/>
          </span>
          Create
        </button>
      </div>

      <div className="border border-slate-300 p-6 rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1.5 rounded-md outline-1 -outline-offset-2 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500"
              onChange={(e) => handleSearchByName(e.target.value)}
            />

            <select
              onChange={(e) => handleFilterByCategory(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-gray-300">
              <option value="">All Categories</option>
              {categories.map((category, i) => (
                <option key={i} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ProductTable products={filteredProducts.length > 0 ? filteredProducts : products} handleDelete={handleDelete} />
      </div>

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
