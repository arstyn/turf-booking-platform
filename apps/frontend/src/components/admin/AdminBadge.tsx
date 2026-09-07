export type BadgeVariant =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "purple";

interface AdminBadgeProps {
    status?: string;
    variant?: BadgeVariant;
    label?: string;
    size?: "sm" | "md";
}

export default function AdminBadge({
    status,
    variant,
    label,
    size = "sm",
}: AdminBadgeProps) {
    const rawStatus = (status || label || "").toLowerCase();

    const resolveVariant = (): BadgeVariant => {
        if (variant) return variant;
        if (
            [
                "confirmed",
                "completed",
                "approved",
                "active",
                "published",
                "resolved",
                "success",
            ].includes(rawStatus)
        ) {
            return "success";
        }
        if (
            ["pending", "draft", "requested", "in_progress"].includes(
                rawStatus,
            )
        ) {
            return "warning";
        }
        if (
            ["cancelled", "rejected", "failed", "closed", "error"].includes(
                rawStatus,
            )
        ) {
            return "danger";
        }
        if (rawStatus === "admin") {
            return "purple";
        }
        if (rawStatus === "turf_owner") {
            return "info";
        }
        return "neutral";
    };

    const resolvedVariant = resolveVariant();

    const variantStyles: Record<
        BadgeVariant,
        { bg: string; text: string; dot: string; border: string }
    > = {
        success: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            dot: "bg-emerald-500",
            border: "border-emerald-200/60",
        },
        warning: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            dot: "bg-amber-500",
            border: "border-amber-200/60",
        },
        danger: {
            bg: "bg-rose-50",
            text: "text-rose-700",
            dot: "bg-rose-500",
            border: "border-rose-200/60",
        },
        info: {
            bg: "bg-sky-50",
            text: "text-sky-700",
            dot: "bg-sky-500",
            border: "border-sky-200/60",
        },
        purple: {
            bg: "bg-purple-50",
            text: "text-purple-700",
            dot: "bg-purple-500",
            border: "border-purple-200/60",
        },
        neutral: {
            bg: "bg-gray-50",
            text: "text-gray-700",
            dot: "bg-gray-400",
            border: "border-gray-200/80",
        },
    };

    const currentStyle = variantStyles[resolvedVariant];
    const displayLabel =
        label ||
        (status
            ? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "");

    const sizeClass =
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} ${sizeClass}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot}`} />
            <span className="capitalize">{displayLabel}</span>
        </span>
    );
}
