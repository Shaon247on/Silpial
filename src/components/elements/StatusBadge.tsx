import { getStatusBg, getStatusLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ClauseStatus, DocumentStatus } from "@/types/index.type";

interface StatusBadgeProps {
  status: ClauseStatus | DocumentStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        getStatusBg(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}