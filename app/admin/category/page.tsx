"use client";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import UpdateCategoryModal from "@/components/UpdateCategoryModal";
import StatsCard from "@/components/StatsCard";
import { useAppContext } from "@/context/AppContext";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types/category";
import { ChevronRight, Home, Package, PackageOpen, Plus, Tag, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Edit01, Trash01, DotsVertical } from "@untitledui/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

const PAGE_SIZE = 10;

const CategoryAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetchCategory = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteByCategory = async (id: number) => {
    try {
      const response = await categoryService.delete(id);
      if (response.success) {
        toast.success("Category deleted successfully.");
        handleFetchCategory();
      }
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  useEffect(() => {
    if (!sessionReady) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await categoryService.getAll();
        if (response.success) setCategories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionReady]);

  const filtered = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : categories;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalProducts = categories.reduce((sum, c) => sum + (Array.isArray(c.products) ? c.products.length : 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Categories</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Categories</h1>
          <p className="mt-1 text-sm text-tertiary">Create, search, edit, and organize product categories.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary_hover"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatsCard icon={<Tag className="text-indigo-500" />} accent="bg-indigo-50" label="Categories" value={categories.length} trend={+3} />
        <StatsCard icon={<Package className="text-indigo-500" />} accent="bg-indigo-50" label="Products" value={totalProducts} trend={+10} />
        <StatsCard icon={<PackageOpen className="text-indigo-500" />} accent="bg-indigo-50" label="Empty" value={categories.filter((c) => !c.products?.length).length} trend={-1} />
      </div>

      <TableCard.Root>
        {/* Search bar */}
        <div className="flex items-center gap-3 border-b border-secondary bg-primary px-4 py-3 md:px-6">
          <div className="relative max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search categories…"
              className="h-9 w-full rounded-lg border border-secondary bg-primary pl-8 pr-3 text-sm font-medium text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>
        </div>

        <Table aria-label="Categories table">
          <Table.Header>
            <Table.Head id="id" label="ID" isRowHeader />
            <Table.Head id="name" label="Name" allowsSorting />
            <Table.Head id="description" label="Description" />
            <Table.Head id="products" label="Products" />
            <Table.Head id="created" label="Created" />
            <Table.Head id="status" label="Status" />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={isLoading ? [] : paginated}>
            {(item) => (
              <Table.Row id={item.id}>
                <Table.Cell className="text-xs font-semibold text-quaternary">{item.id}</Table.Cell>
                <Table.Cell>
                  <span className="text-sm font-semibold text-primary">{item.name}</span>
                </Table.Cell>
                <Table.Cell>
                  <p className="max-w-md truncate text-sm text-tertiary">{item.description}</p>
                </Table.Cell>
                <Table.Cell>
                  {(() => {
                    const count = Array.isArray(item.products) ? item.products.length : 0;
                    return <Badge type="pill-color" color="gray" size="sm">{count} product{count !== 1 ? "s" : ""}</Badge>;
                  })()}
                </Table.Cell>
                <Table.Cell>
                  {item.createdAt ? (
                    <span className="text-xs text-tertiary">{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  ) : <span className="text-quaternary">—</span>}
                </Table.Cell>
                <Table.Cell>
                  <BadgeWithDot type="pill-color" color={item.status ? "success" : "error"} size="sm">
                    {item.status ? "Active" : "Inactive"}
                  </BadgeWithDot>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => setEditingCategory(item)} className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary" aria-label="Edit category"><Edit01 className="size-4" /></button>
                    <button type="button" onClick={() => handleDeleteByCategory(item.id)} className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary" aria-label="Delete category"><Trash01 className="size-4" /></button>
                    <button type="button" className="flex size-8 items-center justify-center rounded-lg text-quaternary transition hover:bg-secondary hover:text-primary" aria-label="More options"><DotsVertical className="size-4" /></button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {!isLoading && paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary"><Tag size={20} /></div>
            <p className="text-sm font-semibold text-primary">No categories found</p>
            <p className="text-xs text-tertiary">Create a new category to get started.</p>
          </div>
        )}
        {isLoading && <div className="px-6 py-12 text-center text-sm text-tertiary">Loading categories…</div>}

        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40">
            <ArrowLeft className="size-4" /> Previous
          </button>
          <span className="text-xs text-tertiary">Page <span className="font-semibold text-primary">{currentPage}</span> of <span className="font-semibold text-primary">{totalPages}</span> · <span className="font-semibold text-primary">{filtered.length}</span> categories</span>
          <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40">
            Next <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>

      {isModalOpen && (
        <CreateCategoryModal handleClose={() => { setIsModalOpen(false); handleFetchCategory(); }} />
      )}

      {editingCategory && (
        <UpdateCategoryModal category={editingCategory} onClose={() => setEditingCategory(null)} onUpdated={handleFetchCategory} />
      )}
    </div>
  );
};

export default CategoryAdminPage;
