import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function AdminModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = "lg",
}: AdminModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
    }[maxWidth];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div
                className={`relative w-full ${maxWidthClass} bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10 transition-all animate-in zoom-in-95 duration-200`}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}
