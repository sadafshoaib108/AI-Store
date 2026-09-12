"use client";

type OrderFilter = "all" | "pending" | "processing" | "completed" | "cancelled";

type OrderFiltersProps = {
  value: OrderFilter;
  onChange: (value: OrderFilter) => void;
};

const filters: Array<{ value: OrderFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderFilters({ value, onChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const active = value === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
              active
                ? "bg-indigo-600 text-white"
                : "border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
