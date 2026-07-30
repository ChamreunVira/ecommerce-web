"use client";
import StatsCard from "@/components/StatsCard";
import UpdateProductModal from "@/components/UpdateProductModal";
import { useAppContext } from "@/context/AppContext";
import { productService } from "@/services/product-service";
import { Product } from "@/types/product";
import { AlertCircle, ChevronRight, Home, Package, PackageOpen, Plus, Tag, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;
const PAGE_SIZE = 10;

const ProductAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAll();
      if (response.success) setProducts(response.data);
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

  useEffect(() => {
    if (!sessionReady) return;
    handleFetchProduct();
  }, [sessionReady]);

  const categoryNames = [...new Set(products.map((p) => p.categoryName))];

  const filtered = products.filter((p) => {
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = !categoryFilter || p.categoryName === categoryFilter;
    return matchQuery && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const lowStock = products.filter((p) => p.qty > 0 && p.qty < 5).length;
  const outOfStock = products.filter((p) => p.qty <= 0).length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Products</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Products</h1>
          <p className="mt-1 text-sm text-tertiary">Manage product catalog, pricing, discount, and stock levels.</p>
        </div>
        <Link
          href="/admin/product/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary_hover"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-indigo-500" />} accent="bg-indigo-50" label="Products" value={products.length} trend={+1} />
        <StatsCard icon={<Tag className="text-emerald-500" />} accent="bg-emerald-50" label="Categories" value={categoryNames.length} trend={+10} />
        <StatsCard icon={<AlertCircle className="text-amber-500" />} accent="bg-amber-50" label="Low Stocks" value={lowStock} trend={-1} />
        <StatsCard icon={<PackageOpen className="text-rose-500" />} accent="bg-rose-50" label="Out of Stock" value={outOfStock} trend={+2} />
      </div>

      <TableCard.Root>
        {/* Search + Filter */}
        <div className="flex flex-col gap-3 border-b border-secondary bg-primary px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="relative max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search products…"
              className="h-9 w-full rounded-lg border border-secondary bg-primary pl-8 pr-3 text-sm font-medium text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary outline-none"
          >
            <option value="">All Categories</option>
            {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <Table aria-label="Products table">
          <Table.Header>
            <Table.Head id="name" label="Product" isRowHeader allowsSorting />
            <Table.Head id="category" label="Category" allowsSorting />
            <Table.Head id="price" label="Price" allowsSorting />
            <Table.Head id="discount" label="Discount" />
            <Table.Head id="stock" label="Stock" allowsSorting />
            <Table.Head id="updated" label="Updated" allowsSorting />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={isLoading ? [] : paginated}>
            {(product) => {
              const img = product.images?.[0];
              const qty = Number(product.qty);
              const stockColor = qty <= 0 ? "error" : qty < 10 ? "warning" : "success";
              const disc = Number(product.discount);
              return (
                <Table.Row id={product.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-secondary bg-tertiary">
                        {img ? (
                          <Image src={`${BASE_IMG}/${img}`} alt={product.name} width={48} height={48} className="h-full w-full object-cover" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-quaternary">IMG</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-48 truncate text-sm font-semibold text-primary">{product.name}</p>
                        <p className="mt-0.5 max-w-48 truncate text-xs text-tertiary">{product.description}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge type="pill-color" color="gray" size="sm">{product.categoryName}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-mono text-sm font-semibold text-primary">${Number(product.price).toFixed(2)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {disc > 0 ? <Badge type="pill-color" color="error" size="sm">-{disc}%</Badge> : <span className="text-quaternary">—</span>}
                  </Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={stockColor} size="sm">
                      {qty <= 0 ? "Out of stock" : `${qty} in stock`}
                    </BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell>
                    {product.updatedAt ? (
                      <span className="text-xs text-tertiary">{new Date(product.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    ) : <span className="text-quaternary">—</span>}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => setEditProduct(product)} className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary" aria-label="Edit product"><Edit01 className="size-4" /></button>
                      <button type="button" onClick={() => handleDelete(Number(product.id))} className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary" aria-label="Delete product"><Trash01 className="size-4" /></button>
                      <button type="button" className="flex size-8 items-center justify-center rounded-lg text-quaternary transition hover:bg-secondary hover:text-primary" aria-label="More options"><DotsVertical className="size-4" /></button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {!isLoading && paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary"><Package size={20} /></div>
            <p className="text-sm font-semibold text-primary">No products found</p>
            <p className="text-xs text-tertiary">Try adjusting your search or filters.</p>
          </div>
        )}
        {isLoading && <div className="px-6 py-12 text-center text-sm text-tertiary">Loading products…</div>}

        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40">
            <ArrowLeft className="size-4" /> Previous
          </button>
          <span className="text-xs text-tertiary">Page <span className="font-semibold text-primary">{currentPage}</span> of <span className="font-semibold text-primary">{totalPages}</span> · <span className="font-semibold text-primary">{filtered.length}</span> products</span>
          <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40">
            Next <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>

      {editProduct && (
        <UpdateProductModal categories={[]} product={editProduct} onClose={() => setEditProduct(null)} onUpdated={handleFetchProduct} />
      )}
    </div>
  );
};

export default ProductAdminPage;
