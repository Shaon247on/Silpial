export type FilterMode = "monthly" | "weekly";

export default function PillToggle({
  value,
  onChange,
}: {
  value: FilterMode;
  onChange: (v: FilterMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {(["monthly", "weekly"] as FilterMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
            value === mode
              ? "bg-white text-[#07172D] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {mode === "monthly" ? "Monthly" : "Weekly"}
        </button>
      ))}
    </div>
  );
}
