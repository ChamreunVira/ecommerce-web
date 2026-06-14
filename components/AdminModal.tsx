"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type AdminModalProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  onClose: () => void;
};

export default function AdminModal({
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-2xl",
  onClose,
}: AdminModalProps) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className={`flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-200`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
