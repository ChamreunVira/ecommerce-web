"use client";
import Link from "next/link";
import { ChevronRight, Home, Tag, TicketCheck, Percent, Clock, CheckCircle2, Plus, Pencil } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import PromotionModal from "@/components/PromotionModal";
import { useEffect, useState } from "react";
import { promotionService } from "@/services/promotion-service";
import { Promotion } from "@/types/promotion";

const statusStyle: Record<Promotion["status"], string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  EXPIRED: "bg-rose-50 text-rose-700 ring-rose-200",
  SCHEDULED: "bg-sky-50 text-sky-700 ring-sky-200",
  PAUSED: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  DISABLED: "bg-slate-50 text-slate-700 ring-slate-200",
};

export default function PromotionsPage() {

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

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
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Promotions</span>
      </nav>

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
            <Tag className="text-orange-500" size={24} /> Promotions & Coupons
          </h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage discount codes, promotional offers, and flash sales.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          New promotion
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<TicketCheck className="text-orange-500" />} accent="bg-orange-50" label="Total Uses" value={totalUses} trend={+12} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Active" value={active} trend={0} />
        <StatsCard icon={<Clock className="text-sky-500" />} accent="bg-sky-50" label="Scheduled" value={scheduled} trend={0} />
        <StatsCard icon={<Percent className="text-rose-500" />} accent="bg-rose-50" label="Expired" value={expired} trend={0} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Code</th>
              <th className="px-5 py-4 font-semibold">Type</th>
              <th className="px-5 py-4 font-semibold text-center">Value</th>
              <th className="px-5 py-4 font-semibold text-center">Min. Order</th>
              <th className="px-5 py-4 font-semibold text-center">Used / Limit</th>
              <th className="px-5 py-4 font-semibold">Expiry</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {promotions?.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">{p.code}</span>
                </td>
                <td className="px-5 py-4 text-slate-600">{p.type}</td>
                <td className="px-5 py-4 text-center font-semibold text-slate-900">
                  {p.type === "PERCENTAGE" ? `${p.value}%` : p.type === "FIXED_AMOUNT" ? `$${p.value}` : "Free"}
                </td>
                <td className="px-5 py-4 text-center text-slate-500">${p.minimumOrder}</td>
                <td className="px-5 py-4 text-center">
                  <div className="text-sm text-slate-700">{p.usageCount} / {p.usageLimit}</div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min((p.usageCount/p.usageLimit)*100, 100)}%` }} />
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500">{p.expiryAt}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => openEditModal(p)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <PromotionModal
          promotion={selectedPromotion}
          onClose={closeModal}
          onSaved={handleFetchPromotions}
        />
      ) : null}
    </div>
  );
}
