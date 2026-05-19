"use client";
import CreateProductModal from "@/components/CreateProductModal";
import ProductTable from "@/components/ProductTable";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import { LayoutListIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ProductAdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategoies] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFetchProduct = async () => {
    try {
      const response = await productService.getAll();
      if (response.success) {
        const existsCategoy = response.data.map(
          (product) => product.categoryName,
        );
        setCategoies([...new Set(existsCategoy)]);
        setProducts(response.data);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    handleFetchProduct();
    return () => new AbortController().abort();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <section className="relative h-full overflow-x-hidden p-12">
      <div className="text-left mb-12">
        <h1 className="flex items-center text-2xl text-gray-800 font-medium leading-12">
          <button className="mr-2">
            <LayoutListIcon />
          </button>
          Product
        </h1>
        <p className="text-base text-gray-500/90">Product management</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-1.5 rounded-md outline-1 -outline-offset-2 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500"
          />

          <select className="px-3 py-1.5 rounded-md border border-gray-300">
            <option defaultValue={categories[0]}>{categories[0]}</option>
            {categories.map((_, i) => (
              <option key={i}>{categories[(i + 1) / categories.length]}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="px-3 py-1.5 bg-orange-500 rounded-md text-white"
          >
            Create
          </button>
        </div>
      </div>

      <ProductTable products={products} />

      {isModalOpen && (
        <CreateProductModal
          categories={categories}
          handleCloseModal={handleCloseModal}
        />
      )}
    </section>
  );
};

export default ProductAdminPage;
