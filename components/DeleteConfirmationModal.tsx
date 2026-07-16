"use client";

import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

type DeleteConfirmationModalProps = {
  title?: string;
  message?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
};

export default function DeleteConfirmationModal({
  title = "Delete item",
  message,
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-rose-50 p-2 text-rose-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                {message ?? "This action cannot be undone."}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close delete confirmation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
