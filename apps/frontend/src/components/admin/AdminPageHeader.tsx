import React from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    badge?: string;
    actions?: React.ReactNode;
}

export default function AdminPageHeader({
    title,
    description,
    badge,
    actions,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/70">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        {title}
                    </h1>
                    {badge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#E33E33] border border-red-200/60">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-2.5 flex-wrap">
                    {actions}
                </div>
            )}
        </div>
    );
}
