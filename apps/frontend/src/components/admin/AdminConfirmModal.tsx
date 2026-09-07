import React from "react";
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import AdminModal from "./AdminModal";

interface AdminConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "primary";
    loading?: boolean;
}

export default function AdminConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
}: AdminConfirmModalProps) {
    const variantConfig = {
        danger: {
            icon: Trash2,
            iconBg: "bg-rose-50 text-rose-600",
            buttonBg: "bg-rose-600 hover:bg-rose-700 text-white",
        },
        warning: {
            icon: AlertTriangle,
            iconBg: "bg-amber-50 text-amber-600",
            buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
        },
        primary: {
            icon: Info,
            iconBg: "bg-red-50 text-[#E33E33]",
            buttonBg: "bg-[#E33E33] hover:bg-[#c9352b] text-white",
        },
    }[variant];

    const Icon = variantConfig.icon;

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
            <div className="flex items-start gap-4">
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variantConfig.iconBg}`}
                >
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-sm text-gray-600 leading-relaxed">
                    {message}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 ${variantConfig.buttonBg}`}
                >
                    {loading && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {confirmText}
                </button>
            </div>
        </AdminModal>
    );
}
