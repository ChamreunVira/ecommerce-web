"use client";

import { Banner } from "@/types/banner";
import { bannerService } from "@/services/banner-service";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, LayoutTemplate, Wand2, Upload, Loader2 } from "lucide-react";

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

type CreationMode = "manual" | "ai";

async function loadPuter(): Promise<void> {
  if (typeof window !== "undefined" && (window as any).puter) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Puter.js"));
    document.head.appendChild(script);
  });
}

async function enhanceBannerPrompt(rawPrompt: string): Promise<string> {
  await loadPuter();
  const puter = (window as any).puter;

  const result = await puter.ai.chat(
    [
      {
        role: "system",
        content:
          "You rewrite short, rough user input into a single detailed image-generation prompt for an e-commerce promotional banner. " +
          "The banner is wide-format, clean, professional, high-contrast, with clear empty space on one side for overlaid text. " +
          "Keep it under 60 words, describe subject, lighting, composition, and mood. Output only the prompt text, nothing else.",
      },
      { role: "user", content: rawPrompt },
    ],
    { model: "gpt-5.4-nano" }
  );

  const text = typeof result === "string" ? result : result?.message?.content ?? result?.text;
  return (text ?? rawPrompt).trim();
}

async function generateBannerImage(prompt: string): Promise<File> {
  await loadPuter();
  const puter = (window as any).puter;

  const imgEl: HTMLImageElement = await puter.ai.txt2img(prompt, { model: "gpt-image-1.5" });
  const res = await fetch(imgEl.src);
  const blob = await res.blob();
  return new File([blob], `banner-ai-${Date.now()}.png`, { type: blob.type || "image/png" });
}

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

  // --- AI generation state ---
  const [mode, setMode] = useState<CreationMode>("manual");
  const [rawPrompt, setRawPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [generating, setGenerating] = useState(false);

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
    if (!isEdit && !form.image) { toast.error("Add an image or generate one first."); return; }
    setSaving(true);
    try {
      if (isEdit && banner) {
        const formData = populateFormData(form);
        const res = await bannerService.update(banner.id, formData);
        if (res.success) {
          toast.success("Banner updated.");
          onSaved();
          onClose();
        }
      } else {
        const formData = populateFormData(form);
        const res = await bannerService.create(formData);
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

  const populateFormData = (banner: BannerPayload): FormData => {
    const form = new FormData();
    form.append("title", banner.title);
    form.append("subtitle", banner.subtitle);
    if (banner.image) {
      form.append("image", banner.image);
    }
    form.append("buttonLabel", banner.buttonLabel);
    form.append("buttonLink", banner.buttonLink);
    form.append("active", String(banner.active));
    form.append("sortOrder", String(banner.sortOrder));
    return form;
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEnhance = async () => {
    if (!rawPrompt.trim()) { toast.error("Describe the banner you want first."); return; }
    setEnhancing(true);
    try {
      const result = await enhanceBannerPrompt(rawPrompt.trim());
      setEnhancedPrompt(result);
    } catch (err: any) {
      toast.error(err.message || "Failed to enhance prompt.");
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    const promptToUse = enhancedPrompt.trim() || rawPrompt.trim();
    if (!promptToUse) { toast.error("Describe the banner you want first."); return; }
    setGenerating(true);
    try {
      const file = await generateBannerImage(promptToUse);
      setImage(file);
      setForm((prev) => ({ ...prev, image: file }));
      toast.success("Image generated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate image.");
    } finally {
      setGenerating(false);
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

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 max-h-[90vh] overflow-y-auto">
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

          {/* Mode switch */}
          <div>
            <span className="text-sm font-medium text-slate-700">Banner image <span className="text-red-500">*</span></span>
            <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                  mode === "manual" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Upload size={15} /> Upload
              </button>
              <button
                type="button"
                onClick={() => setMode("ai")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
                  mode === "ai" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Wand2 size={15} /> Generate with AI
              </button>
            </div>
          </div>

          {/* Manual upload */}
          {mode === "manual" && (
            <label className="block">
              <input
                type="file"
                accept="image/*"
                name="image"
                className="px-3 py-2 rounded-md block border border-slate-200 text-sm w-full"
                onChange={handleImageChange}
              />
            </label>
          )}

          {/* AI generation */}
          {mode === "ai" && (
            <div className="space-y-3 rounded-lg border border-indigo-100 bg-indigo-50/40 p-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">Describe the banner</span>
                <textarea
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder="e.g. gaming headset and controller, neon blue accents"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <button
                type="button"
                onClick={handleEnhance}
                disabled={enhancing}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-60"
              >
                {enhancing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                {enhancing ? "Enhancing…" : "Enhance prompt"}
              </button>

              {enhancedPrompt && (
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">Enhanced prompt (editable)</span>
                  <textarea
                    value={enhancedPrompt}
                    onChange={(e) => setEnhancedPrompt(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
              >
                {generating ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
                {generating ? "Generating…" : "Generate image"}
              </button>

              <p className="text-[11px] text-slate-500">
                First generation may open a one-time Puter sign-in popup — free, no card required.
              </p>
            </div>
          )}

          {/* Shared preview for both modes */}
          {image && (
            <div className="h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image instanceof File ? URL.createObjectURL(image) : image}
                alt="Banner preview"
                className="h-full w-full object-cover object-center"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

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