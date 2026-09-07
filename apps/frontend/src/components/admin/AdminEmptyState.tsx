import { SearchX, type LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    onResetFilters?: () => void;
    resetText?: string;
}

export default function AdminEmptyState({
    title = "No results found",
    description = "Try adjusting your search terms or clearing active filters to find what you are looking for.",
    icon: Icon = SearchX,
    onResetFilters,
    resetText = "Clear filters",
}: AdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4 border border-gray-200/60">
                <Icon className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
                {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mt-1 mb-5">
                {description}
            </p>
            {onResetFilters && (
                <button
                    onClick={onResetFilters}
                    className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-[#E33E33] bg-red-50 hover:bg-red-100/80 border border-red-200/70 rounded-xl transition-colors"
                >
                    {resetText}
                </button>
            )}
        </div>
    );
}
