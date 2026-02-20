
export default function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3 min-w-37.5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <p className="text-sm font-bold text-[#07172D]">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-0.5">processing events</p>
    </div>
  );
}