import { RotateCcw, Search, X } from "lucide-react";

export interface FilterTab {
    id: string;
    label: string;
    count?: number;
}

interface AdminFilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;
    tabs?: FilterTab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    children?: React.ReactNode;
    hasActiveFilters?: boolean;
    onResetFilters?: () => void;
    rightSlot?: React.ReactNode;
}

export default function AdminFilterBar({
    search,
    onSearchChange,
    searchPlaceholder = "Search...",
    tabs,
    activeTab,
    onTabChange,
    children,
    hasActiveFilters = false,
    onResetFilters,
    rightSlot,
}: AdminFilterBarProps) {
    return (
        <div className="space-y-3 bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200/80 shadow-xs">
            {/* Top row: Tabs if present */}
            {tabs && tabs.length > 0 && onTabChange && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-100 scrollbar-none">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                                    isActive
                                        ? "bg-gray-900 text-white shadow-xs"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <span>{tab.label}</span>
                                {typeof tab.count === "number" && (
                                    <span
                                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                            isActive
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-200/80 text-gray-700"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Filter controls row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px] max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E33E33] transition-all placeholder:text-gray-400"
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                            title="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Additional custom filters / controls */}
                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    {children}

                    {hasActiveFilters && onResetFilters && (
                        <button
                            onClick={onResetFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-[#E33E33] hover:bg-red-50/60 rounded-xl border border-gray-200 transition-colors"
                            title="Reset all filters"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}

                    {rightSlot}
                </div>
            </div>
        </div>
    );
}
