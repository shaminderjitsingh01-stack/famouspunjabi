import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-amber-500/10 text-amber-500",
        variant === "secondary" && "bg-gray-800 text-gray-300",
        variant === "outline" && "border border-gray-700 text-gray-400",
        className
      )}
    >
      {children}
    </span>
  );
}
