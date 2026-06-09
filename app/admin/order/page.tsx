"use client";
import CreateProductModal from "@/components/CreateProductModal";
import OrderTable from "@/components/OrderTable";
import SearchInput from "@/components/SearchInput";
import { orderService } from "@/services/order-service";
import { productService } from "@/services/product-service";
import { Order } from "@/types/order";
import { Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderAdminPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setfilteredOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFetchOrder = async () => {
    try {
      const response = await orderService.getAll();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const callbackFromCreateProductModal = () => {
    handleFetchOrder();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await productService.delete(id);
      if (response.success) {
        toast.success("Product deleted successfully");
        handleFetchOrder();
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  // const handleFilterByCategory = (order: string) => {
  //   const filtered = products.filter((product) => product.categoryName === category);
  //   setFilteredProducts(filtered);
  // };

  const handleSearchByName = (name: string) => {
    const filtered = orders.filter((order) => order.orderCode.toLowerCase().includes(name.toLowerCase()));
    setfilteredOrders(filtered);
  };

  useEffect(() => {
    handleFetchOrder();
    return () => new AbortController().abort();
  }, []);

  return (
    <section className="relative h-full overflow-x-hidden p-12">

      {/* To label */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="flex items-center text-2xl text-gray-800 font-medium leading-12">Product</h1>

        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="flex items-center px-6 py-2 bg-orange-500 rounded-md text-white"
        >
          <span className="mr-2">
            <Plus />
          </span>
          Create
        </button>
      </div>

      {/* search & filter */}
      <div className="flex items-center space-x-2 mb-8">

        <SearchInput onInputChange={handleSearchByName} />

        {/* <select
          onChange={(e) => handleFilterByCategory(e.target.value)}
          className="px-3 py-1.5 rounded-md border border-gray-300">
          <option value="">All Categories</option>
          {categories.map((category, i) => (
            <option key={i} value={category}>
              {category}
            </option>
          ))}
        </select> */}
      </div>

      {/* list data */}
      <OrderTable order={filteredOrders.length > 0 ? filteredOrders : orders} handleDelete={handleDelete} />

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

export default OrderAdminPage;
