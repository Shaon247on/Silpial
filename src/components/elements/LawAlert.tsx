import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface LawAlertProps {
  title: string;
  subtitle: string;
}

export function LawAlert({ subtitle, title }: LawAlertProps) {
  return (
    <Alert className="w-full border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50">
      <InfoIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{subtitle}</AlertDescription>
    </Alert>
  );
}
