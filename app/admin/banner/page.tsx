"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Home,
  LayoutTemplate,
  Plus,
  Search,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  EyeOff,
  Eye,
} from "lucide-react";
import { Edit01, Trash01 } from "@untitledui/icons";
import { useAppContext } from "@/context/AppContext";
import { bannerService } from "@/services/banner-service";
import { Banner } from "@/types/banner";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import StatsCard from "@/components/StatsCard";
import BannerModal from "@/components/BannerModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

const PAGE_SIZE = 10;

export default function BannerAdminPage() {
  const { sessionReady } = useAppContext();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openBannerModal = (banner: Banner | null = null) => {
    setEditingBanner(banner
      ? {
        ...banner,
        title: banner.title ?? "",
        subtitle: banner.subtitle ?? "",
        buttonLabel: banner.buttonLabel ?? "Shop Now",
        buttonLink: banner.buttonLink ?? "/products",
      }
      : null,
    );
    setModalOpen(true);
  };

  const closeBannerModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
  };

  const fetchBanners = async () => {
    try {
      const response = await bannerService.getAll();
      if (response.success) setBanners(response.data);
    } catch {
      toast.error("Failed to load banners.");
    }
  };

  useEffect(() => {
    if (!sessionReady) return;
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchBanners();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionReady]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await bannerService.delete(deleteTarget.id);
      if (res.success) { toast.success("Banner deleted."); await fetchBanners(); }
    } catch {
      toast.error("Failed to delete banner.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await bannerService.toggleActive(id);
      if (res.success) { toast.success(`Banner ${res.data.active ? "activated" : "deactivated"}.`); fetchBanners(); }
    } catch {
      toast.error("Failed to update banner status.");
    }
  };

  const filtered = query
    ? banners.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()))
    : banners;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeBanners = banners.filter((b) => b.active).length;
  const inactiveBanners = banners.length - activeBanners;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Banners</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Banners</h1>
          <p className="mt-1 text-sm text-tertiary">
            Create and manage promotional banners displayed on the storefront.
          </p>
        </div>
        <button
          onClick={() => openBannerModal(null)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-600"
        >
          <Plus size={16} />
          Add Banner
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard icon={<LayoutTemplate className="text-indigo-500" />} accent="bg-indigo-50" label="Total" value={banners.length} trend={0} />
        <StatsCard icon={<Eye className="text-green-500" />} accent="bg-green-50" label="Active" value={activeBanners} trend={0} />
        <StatsCard icon={<EyeOff className="text-slate-400" />} accent="bg-slate-50" label="Inactive" value={inactiveBanners} trend={0} />
      </div>

      {/* Table */}
      <TableCard.Root>
        {/* Search */}
        <div className="flex items-center gap-3 border-b border-secondary bg-primary px-4 py-3 md:px-6">
          <div className="relative max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search banners…"
              className="h-9 w-full rounded-lg border border-secondary bg-primary pl-8 pr-3 text-sm font-medium text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>
        </div>

        <Table aria-label="Banners table">
          <Table.Header>
            <Table.Head id="id" label="ID" isRowHeader />
            <Table.Head id="preview" label="Preview" />
            <Table.Head id="title" label="Title" allowsSorting />
            <Table.Head id="button" label="Button" />
            <Table.Head id="order" label="Order" />
            <Table.Head id="status" label="Status" />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={isLoading ? [] : paginated}>
            {(item) => (
              <Table.Row id={item.id}>
                <Table.Cell className="text-xs font-semibold text-quaternary">{item.id}</Table.Cell>

                {/* Image preview */}
                <Table.Cell>
                  <div className="h-10 w-20 overflow-hidden rounded-md border border-secondary bg-secondary">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}/${item.imageUrl}`}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-quaternary">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <div>
                    <p className="text-sm font-semibold text-primary">{item.title}</p>
                    {item.subtitle && (
                      <p className="max-w-xs truncate text-xs text-tertiary">{item.subtitle}</p>
                    )}
                  </div>
                </Table.Cell>

                <Table.Cell>
                  {item.buttonLabel ? (
                    <Badge type="pill-color" color="gray" size="sm">
                      {item.buttonLabel}
                    </Badge>
                  ) : (
                    <span className="text-quaternary">—</span>
                  )}
                </Table.Cell>

                <Table.Cell>
                  <span className="text-sm text-tertiary">{item.sortOrder}</span>
                </Table.Cell>

                <Table.Cell>
                  <BadgeWithDot type="pill-color" color={item.active ? "success" : "error"} size="sm">
                    {item.active ? "Active" : "Inactive"}
                  </BadgeWithDot>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title={item.active ? "Deactivate" : "Activate"}
                      onClick={() => handleToggle(item.id)}
                      className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                    >
                      {item.active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openBannerModal(item)}
                      className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                      aria-label="Edit banner"
                    >
                      <Edit01 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary"
                      aria-label="Delete banner"
                    >
                      <Trash01 className="size-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {!isLoading && paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <LayoutTemplate size={20} />
            </div>
            <p className="text-sm font-semibold text-primary">No banners found</p>
            <p className="text-xs text-tertiary">Add a banner to promote your products.</p>
          </div>
        )}
        {isLoading && (
          <div className="px-6 py-12 text-center text-sm text-tertiary">Loading banners…</div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Previous
          </button>
          <span className="text-xs text-tertiary">
            Page <span className="font-semibold text-primary">{currentPage}</span> of{" "}
            <span className="font-semibold text-primary">{totalPages}</span> ·{" "}
            <span className="font-semibold text-primary">{filtered.length}</span> banners
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40"
          >
            Next <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>

      {/* Modal */}
      {modalOpen && (
        <BannerModal
          key={editingBanner?.id ?? "new-banner-modal"}
          banner={editingBanner}
          onClose={closeBannerModal}
          onSaved={fetchBanners}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmationModal
          title="Delete banner"
          message={<>Are you sure you want to delete <span className="font-semibold text-primary">{deleteTarget.title}</span>? This action cannot be undone.</>}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
