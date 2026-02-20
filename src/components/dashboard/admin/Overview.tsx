"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  FolderOpen,
  BarChart3
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PillToggle, { FilterMode } from "@/components/elements/PillToggle";
import { MONTHLY_DATA, OVERVIEW_STATS, WEEKLY_DATA } from "@/data/adminData";
import { ActivityDataPoint } from "@/types/Admin.type";
import StatCard, { StatCardProps } from "@/components/elements/StatCard";
import CustomTooltip from "@/components/elements/CustomTooltip";


export default function OverviewPage() {
  const [filter, setFilter] = useState<FilterMode>("monthly");
  const data: ActivityDataPoint[] = filter === "monthly" ? MONTHLY_DATA : WEEKLY_DATA;

  const formatYAxis = (val: number) => {
    if (val === 0) return "0";
    if (val >= 1000) return `${val / 1000}k`;
    return String(val);
  };

  const stats: StatCardProps[] = [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Total de Usuarios",
      value: OVERVIEW_STATS.totalUsers,
      trend: "+12%",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Leyes Cargadas",
      value: OVERVIEW_STATS.uploadedLaws.toLocaleString(),
      trend: "+8%",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Documentos Procesados",
      value: OVERVIEW_STATS.documentsProcessed.toLocaleString(),
      trend: "+24%",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Análisis de IA",
      value: OVERVIEW_STATS.aiAnalyses.toLocaleString(),
      trend: "+18%",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#07172D]">General</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitoreo general del sistema y salud de la plataforma
          </p>
        </div>
        <Badge
          variant="outline"
          className="self-start sm:self-auto text-xs text-gray-500 border-gray-200 bg-white gap-1.5 px-3 py-1.5 rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Datos en vivo
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Chart card */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-0 pt-5 px-6">
          <div>
            <CardTitle className="text-base font-bold text-[#07172D]">
              Processing Activity
            </CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">
              {filter === "monthly" ? "Jan – Dec 2025" : "This week"}
            </p>
          </div>
          <PillToggle value={filter} onChange={setFilter} />
        </CardHeader>

        <CardContent className="pt-4 pb-4 px-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={38}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#blueGrad)"
                dot={{ r: 3.5, fill: "#07172D", strokeWidth: 0 }}
                activeDot={{ r: 5.5, fill: "#07172D", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}