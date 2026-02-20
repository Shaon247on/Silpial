import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  iconBg: string;
  iconColor: string;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

export default function StatCard({
  icon,
  label,
  value,
  trend,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            <span className={iconColor}>{icon}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#07172D] tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </CardContent>
    </Card>
  );
}
