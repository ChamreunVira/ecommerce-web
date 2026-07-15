"use client";

import { promotionService } from "@/services/promotion-service";
import { Promotion } from "@/types/promotion";
import { Plus, Save } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminModal from "./AdminModal";

type PromotionFormData = {
  code: string;
  type: Promotion["type"];
  value: number;
  minimumOrder: number;
  usageLimit: number;
  status: Promotion["status"];
  startAt: string;
  expiryAt: string;
};

type PromotionModalProps = {
  promotion?: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
};

const createInitialFormData = (): PromotionFormData => ({
  code: "",
  type: "PERCENTAGE",
  value: 0,
  minimumOrder: 0,
  usageLimit: 10,
  status: "ACTIVE",
  startAt: "",
  expiryAt: "",
});

const buildFormData = (promotion?: Promotion | null): PromotionFormData => {
  if (!promotion) return createInitialFormData();

  return {
    code: promotion.code,
    type: promotion.type,
    value: promotion.value,
    minimumOrder: promotion.minimumOrder,
    usageLimit: promotion.usageLimit,
    status: promotion.status,
    startAt: formatDateTimeInputValue(promotion.startAt),
    expiryAt: formatDateTimeInputValue(promotion.expiryAt),
  };
};

function formatDateTimeInputValue(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  if (!value) return "";
  return new Date(value).toISOString();
}

export default function PromotionModal({ promotion, onClose, onSaved }: PromotionModalProps) {
  const [formData, setFormData] = useState<PromotionFormData>(() => buildFormData(promotion));
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = useMemo(() => Boolean(promotion), [promotion]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "value" || name === "minimumOrder" || name === "usageLimit"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        minimumOrder: Number(formData.minimumOrder),
        usageLimit: Number(formData.usageLimit),
        startAt: toIsoDateTime(formData.startAt),
        expiryAt: toIsoDateTime(formData.expiryAt),
      };

      const response = isEditing
        ? await promotionService.update(promotion!.id, payload)
        : await promotionService.create(payload);

      if (response.success) {
        toast.success(isEditing ? "Promotion updated successfully." : "Promotion created successfully.");
        onSaved();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(isEditing ? "Failed to update promotion." : "Failed to create promotion.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      title={isEditing ? "Update promotion" : "Create promotion"}
      description={isEditing ? "Adjust the promotion details and save the changes." : "Create a new promotion code for your store."}
      onClose={onClose}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            form="promotion-form"
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isEditing ? <Save size={16} /> : <Plus size={16} />}
            {isSaving ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save changes" : "Create promotion"}
          </button>
        </div>
      }
    >
      <form id="promotion-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="code">
              Promotion code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              placeholder="vira168"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED_AMOUNT">Fixed amount</option>
              <option value="FREE_SHIPPING">Free shipping</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="value">
              Value
            </label>
            <input
              id="value"
              name="value"
              type="number"
              min="0"
              value={formData.value}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="minimumOrder">
              Minimum order
            </label>
            <input
              id="minimumOrder"
              name="minimumOrder"
              type="number"
              min="0"
              value={formData.minimumOrder}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="usageLimit">
              Usage limit
            </label>
            <input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="ACTIVE">Active</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PAUSED">Paused</option>
              <option value="EXPIRED">Expired</option>
              <option value="DISABLED">Disabled</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="startAt">
              Start date
            </label>
            <input
              id="startAt"
              name="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="expiryAt">
              Expiry date
            </label>
            <input
              id="expiryAt"
              name="expiryAt"
              type="datetime-local"
              value={formData.expiryAt}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
