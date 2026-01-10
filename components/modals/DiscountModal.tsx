"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface DiscountModalProps {
  product: any; // Ideally replace with Product interface
  onClose: () => void;
  onSaved: () => void;
}

export default function DiscountModal({
  product,
  onClose,
  onSaved,
}: DiscountModalProps) {
  const [value, setValue] = useState(
    product.discountType === "PERCENT"
      ? product.discountValue ?? ""
      : ""
  );

  const hasDiscount = product.discountType === "PERCENT";

  const save = async () => {
    await api.put(`/products/${product.id}/discount`, {
      discountType: value ? "PERCENT" : null,
      discountValue: value ? Number(value) : null,
    });

    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-bold">
          Discount – {product.title}
        </h2>

        {/* Percentage input only */}
        <input
          type="number"
          min={0}
          max={90}
          placeholder="Discount percentage (e.g. 10)"
          className="border p-2 w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <p className="text-xs text-gray-500">
          Enter percentage discount. Leave empty to remove discount.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="bg-brandPink text-white px-4 py-2 rounded text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
