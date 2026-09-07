import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
}

export default function AdminPagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50],
}: AdminPaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(totalItems, currentPage * pageSize);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200/80 text-sm">
            <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
                <span>
                    Showing <strong className="text-gray-800">{startItem}</strong> to{" "}
                    <strong className="text-gray-800">{endItem}</strong> of{" "}
                    <strong className="text-gray-800">{totalItems}</strong> entries
                </span>
                {onPageSizeChange && (
                    <div className="flex items-center gap-1.5 ml-2">
                        <span className="text-xs text-gray-400">Rows:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                onPageSizeChange(Number(e.target.value));
                                onPageChange(1);
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-200"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${idx}`}
                                className="px-2 py-1 text-xs text-gray-400 select-none"
                            >
                                ...
                            </span>
                        );
                    }
                    const isCurrent = page === currentPage;
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg transition-colors ${
                                isCurrent
                                    ? "bg-[#E33E33] text-white shadow-xs"
                                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
