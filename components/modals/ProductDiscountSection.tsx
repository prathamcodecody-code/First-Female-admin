"use client";

interface Props {
  price: string;
  discountType: string;
  discountValue: string;
  onChange: (data: {
    discountType: string;
    discountValue: string;
  }) => void;
}

function calculateFinalPrice(
  price: number,
  discountType?: string,
  discountValue?: number
) {
  if (!discountType || !discountValue) return price;

  if (discountType === "PERCENT") {
    return Math.max(
      0,
      price - (price * discountValue) / 100
    );
  }

  if (discountType === "FLAT") {
    return Math.max(0, price - discountValue);
  }

  return price;
}

export default function ProductDiscountSection({
  price,
  discountType,
  discountValue,
  onChange,
}: Props) {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discountValue || 0);

  let finalPrice = numericPrice;

  if (discountType === "PERCENT") {
    finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;
  }

  if (discountType === "FLAT") {
    finalPrice = numericPrice - numericDiscount;
  }

  finalPrice = Math.max(finalPrice, 0);

  return (
    <div className="bg-white shadow rounded-xl p-5 space-y-4">
      <h2 className="text-lg font-semibold text-brandBlack">
        Discount (Optional)
      </h2>

      <select
        className="border p-2 w-full bg-brandCream/40"
        value={discountType}
        onChange={(e) =>
          onChange({
            discountType: e.target.value,
            discountValue: "",
          })
        }
      >
        <option value="">No Discount</option>
        <option value="PERCENT">Percentage</option>
        <option value="FLAT">Flat Amount</option>
      </select>

      <input
        type="number"
        disabled={!discountType}
        placeholder="Discount value"
        className="border p-2 w-full bg-brandCream/40"
        value={discountValue}
        onChange={(e) =>
          onChange({
            discountType,
            discountValue: e.target.value,
          })
        }
      />

      {discountType && (
        <div className="text-sm text-gray-600">
          Final Price:&nbsp;
          <span className="font-semibold text-brandPink">
            ₹{finalPrice.toFixed(0)}
          </span>
        </div>
      )}
    </div>
  );
}
