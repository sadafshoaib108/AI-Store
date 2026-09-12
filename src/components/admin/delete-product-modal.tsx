"use client";

import { AlertTriangle, X } from "lucide-react";

type DeleteProductModalProps = {
  open: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteProductModal({
  open,
  productName,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Delete Product
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-400">
                Remove <span className="font-medium text-white">{productName}</span>{" "}
                from your catalog? This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close delete confirmation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
