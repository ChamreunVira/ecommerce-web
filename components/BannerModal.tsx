"use client";

import { Banner } from "@/types/banner";
import { bannerService } from "@/services/banner-service";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, LayoutTemplate } from "lucide-react";

type BannerPayload = Omit<Banner, "id" | "imageUrl" | "createdAt" | "updatedAt"> & { image: any };

const defaultForm: BannerPayload = {
  title: "",
  subtitle: "",
  image: null,
  buttonLabel: "Shop Now",
  buttonLink: "/products",
  active: true,
  sortOrder: 0,
};

type Props = {
  banner?: Banner | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function BannerModal({ banner, onClose, onSaved }: Props) {
  const isEdit = !!banner;
  const [image, setImage] = useState<any>(null);
  const [form, setForm] = useState<BannerPayload>(
    banner
      ? {
        title: banner.title,
        subtitle: banner.subtitle,
        image: image,
        buttonLabel: banner.buttonLabel,
        buttonLink: banner.buttonLink,
        active: banner.active,
        sortOrder: banner.sortOrder,
      }
      : defaultForm,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    setSaving(true);
    try {
      if (isEdit && banner) {
        const res = await bannerService.update(banner.id, { ...form, sortOrder: Number(form.sortOrder) });
        if (res.success) {
          toast.success("Banner updated.");
          onSaved();
          onClose();
        }
      } else {
        const res = await bannerService.create({ ...form, sortOrder: Number(form.sortOrder) });
        if (res.success) {
          toast.success("Banner created.");
          onSaved();
          onClose();
        }
      }
    } catch {
      toast.error("Failed to save banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 ring-1 ring-indigo-100">
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {isEdit ? "Edit Banner" : "New Banner"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit ? "Update banner details." : "Create a new promotional banner."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Title */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></span>
            <input
              name="title"
              value={form.title}
              onChange={update}
              placeholder="Level Up Your Gaming Experience"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* Subtitle */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Subtitle</span>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={update}
              placeholder="From immersive sound to precise controls…"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* Image URL */}
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Image URL <span className="text-red-500">*</span>
            </span>

            <input
              type="file"
              name="image"
              className="px-3 py-2 rounded-md block border border-ind"
              onChange={handleImageChange}
            />

            {/* Image preview */}
            {image && (
              <div className="mt-2 h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(image)}
                  alt="Banner preview"
                  className="h-full w-full object-cover object-center"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </label>

          {/* Button label + link */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Button Label</span>
              <input
                name="buttonLabel"
                value={form.buttonLabel}
                onChange={update}
                placeholder="Shop Now"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Button Link</span>
              <input
                name="buttonLink"
                value={form.buttonLink}
                onChange={update}
                placeholder="/products"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>

          {/* Sort order + Active */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Sort Order</span>
              <input
                name="sortOrder"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={update}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="flex items-end gap-3 pb-0.5">
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={update}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Active (visible on site)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
