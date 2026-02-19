interface ComplianceScoreProps {
  score: number;
}

export default function ComplianceScore({ score }: ComplianceScoreProps) {
  const getColor = (score: number) => {
    if (score >= 85) return { text: "text-emerald-700", bg: "bg-emerald-50", bar: "bg-emerald-500" };
    if (score >= 60) return { text: "text-amber-700", bg: "bg-amber-50", bar: "bg-amber-500" };
    return { text: "text-red-700", bg: "bg-red-50", bar: "bg-red-500" };
  };

  const colors = getColor(score);

  return (
    <div className="flex items-center gap-2 min-w-27.5">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} ${colors.bg} whitespace-nowrap`}>
        {score}%
      </span>
    </div>
  );
}