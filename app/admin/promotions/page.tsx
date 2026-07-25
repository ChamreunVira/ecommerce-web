"use client";
import Link from "next/link";
import { ChevronRight, Home, Tag, TicketCheck, Percent, Clock, CheckCircle2, Plus } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import PromotionModal from "@/components/PromotionModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { promotionService } from "@/services/promotion-service";
import { Promotion } from "@/types/promotion";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Edit01, Trash01 } from "@untitledui/icons";

const statusMap: Record<Promotion["status"], { color: "success" | "error" | "blue" | "warning" | "gray"; label: string }> = {
  ACTIVE: { color: "success", label: "Active" },
  EXPIRED: { color: "error", label: "Expired" },
  SCHEDULED: { color: "blue", label: "Scheduled" },
  PAUSED: { color: "warning", label: "Paused" },
  DISABLED: { color: "gray", label: "Disabled" },
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const active = promotions?.filter(p => p.status === "ACTIVE").length;
  const expired = promotions?.filter(p => p.status === "EXPIRED").length;
  const scheduled = promotions?.filter(p => p.status === "SCHEDULED").length;
  const totalUses = promotions?.reduce((sum, p) => sum + p.usageCount, 0);

  const handleFetchPromotions = async () => {
    try {
      const response = await promotionService.getAll();
      if (response.success) {
        setPromotions(response.data);
      }
    } catch (error) {
      console.log("Error fetching promotions: ", error);
    }
  };

  const openCreateModal = () => {
    setSelectedPromotion(null);
    setIsModalOpen(true);
  };

  const openEditModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPromotion(null);
    setIsModalOpen(false);
  };

  const handleDeletePromotion = async (promotionId: number) => {
    setIsDeleting(true);

    try {
      const response = await promotionService.delete(promotionId);
      if (response.success) {
        toast.success("Promotion deleted successfully.");
        await handleFetchPromotions();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete promotion.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadPromotions = async () => {
      await handleFetchPromotions();
      if (!isMounted) return;
    };

    void loadPromotions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Promotions</span>
      </nav>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Tag className="text-brand-secondary" size={24} /> Promotions & Coupons
          </h1>
          <p className="mt-1 text-sm text-tertiary">Create and manage discount codes, promotional offers, and flash sales.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary_hover"
        >
          <Plus size={16} />
          New promotion
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<TicketCheck className="text-indigo-500" />} accent="bg-indigo-50" label="Total Uses" value={totalUses} trend={+12} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Active" value={active} trend={0} />
        <StatsCard icon={<Clock className="text-sky-500" />} accent="bg-sky-50" label="Scheduled" value={scheduled} trend={0} />
        <StatsCard icon={<Percent className="text-rose-500" />} accent="bg-rose-50" label="Expired" value={expired} trend={0} />
      </div>

      <Table>
        <Thead>
          <THeading>Code</THeading>
          <THeading>Type</THeading>
          <THeading className="text-center">Value</THeading>
          <THeading className="text-center">Min. Order</THeading>
          <THeading className="text-center">Used / Limit</THeading>
          <THeading>Expiry</THeading>
          <THeading>Status</THeading>
          <THeading className="text-right">Actions</THeading>
        </Thead>
        <TBody>
          {promotions?.map(p => {
            const st = statusMap[p.status] ?? statusMap.ACTIVE;
            return (
              <tr key={p.id} className="hover:bg-secondary transition-colors">
                <TCell>
                  <Badge type="pill-color" color="brand" size="sm" className="font-mono font-bold">
                    {p.code}
                  </Badge>
                </TCell>
                <TCell className="text-tertiary capitalize">{p.type.toLowerCase().replace("_", " ")}</TCell>
                <TCell className="text-center font-semibold text-primary font-mono">
                  {p.type === "PERCENTAGE" ? `${p.value}%` : p.type === "FIXED_AMOUNT" ? `$${p.value}` : "Free"}
                </TCell>
                <TCell className="text-center text-tertiary font-mono">${p.minimumOrder}</TCell>
                <TCell className="text-center">
                  <div className="text-xs font-medium text-secondary">{p.usageCount} / {p.usageLimit}</div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden w-20 mx-auto">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: `${Math.min((p.usageCount / p.usageLimit) * 100, 100)}%` }} />
                  </div>
                </TCell>
                <TCell className="text-tertiary">{p.expiryAt}</TCell>
                <TCell>
                  <BadgeWithDot type="pill-color" color={st.color} size="sm">
                    {st.label}
                  </BadgeWithDot>
                </TCell>
                <TCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="flex size-8 items-center justify-center rounded-lg text-tertiary transition hover:bg-secondary hover:text-primary"
                      aria-label="Edit promotion"
                    >
                      <Edit01 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      className="flex size-8 items-center justify-center rounded-lg text-error-primary transition hover:bg-error-secondary"
                      aria-label="Delete promotion"
                    >
                      <Trash01 className="size-4" />
                    </button>
                  </div>
                </TCell>
              </tr>
            );
          })}
        </TBody>
      </Table>

      {isModalOpen ? (
        <PromotionModal
          promotion={selectedPromotion}
          onClose={closeModal}
          onSaved={handleFetchPromotions}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmationModal
          title="Delete promotion"
          message={
            <>
              Are you sure you want to delete <span className="font-semibold text-primary">{deleteTarget.code}</span>? This will remove the promotion permanently.
            </>
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeletePromotion(deleteTarget.id)}
          isDeleting={isDeleting}
        />
      ) : null}
    </div>
  );
}

