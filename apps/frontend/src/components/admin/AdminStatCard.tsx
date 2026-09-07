import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    description?: string;
    trend?: {
        value: string;
        isPositive?: boolean;
    };
    onClick?: () => void;
}

export default function AdminStatCard({
    title,
    value,
    icon: Icon,
    iconColor = "text-[#E33E33]",
    iconBg = "bg-red-50",
    description,
    trend,
    onClick,
}: AdminStatCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs transition-all duration-200 ${
                onClick
                    ? "cursor-pointer hover:border-gray-300 hover:shadow-sm"
                    : "hover:border-gray-300"
            }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5 tracking-tight">
                        {value}
                    </p>
                </div>
                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
                >
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {(description || trend) && (
                <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    {description && (
                        <span className="text-gray-500 font-medium">
                            {description}
                        </span>
                    )}
                    {trend && (
                        <span
                            className={`font-semibold ml-auto px-1.5 py-0.5 rounded ${
                                trend.isPositive
                                    ? "text-emerald-700 bg-emerald-50"
                                    : "text-amber-700 bg-amber-50"
                            }`}
                        >
                            {trend.value}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
