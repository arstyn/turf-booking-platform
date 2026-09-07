import {
    Building2,
    CheckCircle2,
    Clock,
    MapPin,
    Trash2,
    XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    AdminBadge,
    AdminConfirmModal,
    AdminEmptyState,
    AdminFilterBar,
    AdminModal,
    AdminPageHeader,
    AdminPagination,
    AdminStatCard,
} from "../../components/admin";
import api from "../../services/api";
import type { TurfOwner } from "./types";

export default function AdminTurfOwners() {
    const [owners, setOwners] = useState<TurfOwner[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusTab, setStatusTab] = useState<string>("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Review / Approval Modal
    const [activeOwner, setActiveOwner] = useState<TurfOwner | null>(null);
    const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
    const [reviewNotes, setReviewNotes] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Delete Modal
    const [ownerToDelete, setOwnerToDelete] = useState<TurfOwner | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Feedback message
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users/turf-owners");
            setOwners(res.data || []);
        } catch (error) {
            console.error("Failed to fetch turf owners:", error);
            showFeedback("error", "Failed to load turf partners.");
        } finally {
            setLoading(false);
        }
    };

    const showFeedback = (type: "success" | "error", text: string) => {
        setFeedback({ type, text });
        setTimeout(() => setFeedback(null), 3500);
    };

    const handleOpenReview = (owner: TurfOwner, action: "approve" | "reject") => {
        setActiveOwner(owner);
        setReviewAction(action);
        setReviewNotes(
            action === "approve"
                ? "Approved for platform operations and turf listings"
                : "",
        );
    };

    const handleConfirmReview = async () => {
        if (!activeOwner || !reviewAction) return;

        if (reviewAction === "reject" && !reviewNotes.trim()) {
            showFeedback("error", "Please provide notes/reason for rejection.");
            return;
        }

        try {
            setSubmittingReview(true);
            if (reviewAction === "approve") {
                await api.post(`/users/turf-owners/${activeOwner.id}/approve`, {
                    approvalNotes: reviewNotes.trim(),
                });
                showFeedback(
                    "success",
                    `Approved ${activeOwner.firstName} ${activeOwner.lastName} (${activeOwner.businessName || "Partner"}).`,
                );
            } else {
                await api.post(`/users/turf-owners/${activeOwner.id}/reject`, {
                    approvalNotes: reviewNotes.trim(),
                });
                showFeedback(
                    "success",
                    `Rejected partner application for ${activeOwner.firstName} ${activeOwner.lastName}.`,
                );
            }
            await fetchOwners();
            setActiveOwner(null);
            setReviewAction(null);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showFeedback(
                "error",
                err.response?.data?.message || "Failed to process application.",
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!ownerToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/users/${ownerToDelete.id}`);
            setOwners((prev) => prev.filter((o) => o.id !== ownerToDelete.id));
            showFeedback(
                "success",
                `Turf owner ${ownerToDelete.firstName} ${ownerToDelete.lastName} and associated assets removed.`,
            );
            setOwnerToDelete(null);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showFeedback(
                "error",
                err.response?.data?.message || "Failed to delete turf owner",
            );
        } finally {
            setDeleting(false);
        }
    };

    // Owner counts
    const ownerCounts = useMemo(() => {
        const counts = { all: owners.length, pending: 0, approved: 0 };
        owners.forEach((o) => {
            if (o.isApproved) counts.approved++;
            else counts.pending++;
        });
        return counts;
    }, [owners]);

    // Filtered Owners
    const filteredOwners = useMemo(() => {
        let list = [...owners];

        if (statusTab === "pending") {
            list = list.filter((o) => !o.isApproved);
        } else if (statusTab === "approved") {
            list = list.filter((o) => Boolean(o.isApproved));
        }

        if (search.trim()) {
            const term = search.toLowerCase();
            list = list.filter((o) => {
                const name = `${o.firstName} ${o.lastName}`.toLowerCase();
                return (
                    name.includes(term) ||
                    (o.businessName && o.businessName.toLowerCase().includes(term)) ||
                    (o.email && o.email.toLowerCase().includes(term)) ||
                    (o.phone && o.phone.toLowerCase().includes(term)) ||
                    (o.address && o.address.toLowerCase().includes(term))
                );
            });
        }

        return list;
    }, [owners, statusTab, search]);

    // Pagination slice
    const paginatedOwners = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredOwners.slice(start, start + pageSize);
    }, [filteredOwners, currentPage, pageSize]);

    return (
        <div className="w-full p-5 space-y-6 animate-in fade-in duration-300">
            <AdminPageHeader
                title="Turf Owners"
                description="Review business applications, verify turf owner documentation, and manage partner accounts"
                badge={`${owners.length} Partners`}
            />

            {/* Notification alert banner */}
            {feedback && (
                <div
                    className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200 ${
                        feedback.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                >
                    <span>{feedback.text}</span>
                    <button
                        onClick={() => setFeedback(null)}
                        className="text-xs opacity-75 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminStatCard
                    title="Total Partners"
                    value={ownerCounts.all}
                    icon={Building2}
                    iconColor="text-gray-700"
                    iconBg="bg-gray-100"
                    description="Registered turf providers"
                />
                <AdminStatCard
                    title="Approved Partners"
                    value={ownerCounts.approved}
                    icon={CheckCircle2}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                    trend={{
                        value: `${ownerCounts.all > 0 ? Math.round((ownerCounts.approved / ownerCounts.all) * 100) : 0}% verified`,
                        isPositive: true,
                    }}
                />
                <AdminStatCard
                    title="Pending Verification"
                    value={ownerCounts.pending}
                    icon={Clock}
                    iconColor="text-amber-600"
                    iconBg="bg-amber-50"
                    trend={{
                        value: ownerCounts.pending > 0 ? "Action required" : "Up to date",
                        isPositive: ownerCounts.pending === 0,
                    }}
                />
            </div>

            {/* Filter Bar */}
            <AdminFilterBar
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setCurrentPage(1);
                }}
                searchPlaceholder="Search by owner, business, phone, or location..."
                tabs={[
                    { id: "all", label: "All Owners", count: ownerCounts.all },
                    { id: "pending", label: "Pending Approvals", count: ownerCounts.pending },
                    { id: "approved", label: "Approved Partners", count: ownerCounts.approved },
                ]}
                activeTab={statusTab}
                onTabChange={(tab) => {
                    setStatusTab(tab);
                    setCurrentPage(1);
                }}
                hasActiveFilters={Boolean(search || statusTab !== "all")}
                onResetFilters={() => {
                    setSearch("");
                    setStatusTab("all");
                    setCurrentPage(1);
                }}
            />

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 text-sm animate-pulse">
                        Loading turf owners...
                    </div>
                ) : filteredOwners.length === 0 ? (
                    <AdminEmptyState
                        title="No turf owners found"
                        description="Try clearing your search or switching to another status tab."
                        onResetFilters={() => {
                            setSearch("");
                            setStatusTab("all");
                        }}
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[760px]">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-3 px-5">Partner</th>
                                        <th className="py-3 px-5">Business Profile</th>
                                        <th className="py-3 px-5">Status</th>
                                        <th className="py-3 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                                    {paginatedOwners.map((o) => {
                                        const initials = `${o.firstName.charAt(0)}${o.lastName.charAt(0)}`.toUpperCase();

                                        return (
                                            <tr
                                                key={o.id}
                                                className="hover:bg-gray-50/70 transition-colors"
                                            >
                                                {/* Owner Details */}
                                                <td className="py-3.5 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                            {initials || "P"}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">
                                                                {o.firstName} {o.lastName}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                                {o.email || o.phone || "No direct contact"}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400">
                                                                Registered{" "}
                                                                {new Date(
                                                                    o.createdAt,
                                                                ).toLocaleDateString("en-IN", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Business Details */}
                                                <td className="py-3.5 px-5">
                                                    <div className="space-y-1 max-w-xs">
                                                        <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                                                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                            {o.businessName || "Unnamed Business"}
                                                        </p>
                                                        {o.address ? (
                                                            <p className="text-[11px] text-gray-500 flex items-center gap-1 line-clamp-1">
                                                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                                                <span>{o.address}</span>
                                                            </p>
                                                        ) : (
                                                            <p className="text-[11px] text-gray-400 italic">
                                                                No address registered
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Verification Status */}
                                                <td className="py-3.5 px-5">
                                                    <AdminBadge
                                                        status={
                                                            o.isApproved
                                                                ? "approved"
                                                                : "pending"
                                                        }
                                                        label={
                                                            o.isApproved
                                                                ? "Approved"
                                                                : "Pending Approval"
                                                        }
                                                    />
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-5 text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        {!o.isApproved ? (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        handleOpenReview(
                                                                            o,
                                                                            "approve",
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors"
                                                                    title="Approve partner"
                                                                >
                                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                                    <span>Approve</span>
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleOpenReview(
                                                                            o,
                                                                            "reject",
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors"
                                                                    title="Reject partner"
                                                                >
                                                                    <XCircle className="w-3.5 h-3.5" />
                                                                    <span>Reject</span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-[11px] font-semibold text-gray-400 px-2">
                                                                Verified
                                                            </span>
                                                        )}

                                                        <button
                                                            onClick={() => setOwnerToDelete(o)}
                                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                                                            title="Delete owner"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredOwners.length}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />
                    </>
                )}
            </div>

            {/* Approval / Rejection Modal */}
            <AdminModal
                isOpen={Boolean(activeOwner && reviewAction)}
                onClose={() => {
                    setActiveOwner(null);
                    setReviewAction(null);
                }}
                title={
                    reviewAction === "approve"
                        ? "Approve Turf Business Partner"
                        : "Reject Turf Business Application"
                }
                description={
                    activeOwner
                        ? `Application for ${activeOwner.firstName} ${activeOwner.lastName} (${activeOwner.businessName || "Partner"})`
                        : undefined
                }
                maxWidth="md"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1 text-xs">
                        <p className="text-gray-500">
                            <strong>Owner:</strong> {activeOwner?.firstName}{" "}
                            {activeOwner?.lastName}
                        </p>
                        <p className="text-gray-500">
                            <strong>Email / Phone:</strong> {activeOwner?.email || "—"} /{" "}
                            {activeOwner?.phone || "—"}
                        </p>
                        <p className="text-gray-500">
                            <strong>Business:</strong>{" "}
                            {activeOwner?.businessName || "Unnamed Business"}
                        </p>
                        {activeOwner?.address && (
                            <p className="text-gray-500">
                                <strong>Address:</strong> {activeOwner.address}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            {reviewAction === "approve"
                                ? "Approval Notes / Terms"
                                : "Reason for Rejection (Required)"}
                        </label>
                        <textarea
                            rows={3}
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder={
                                reviewAction === "approve"
                                    ? "Add verification notes or approval terms..."
                                    : "Specify why the application is being rejected (e.g. missing documentation)..."
                            }
                            className="w-full p-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E33E33]"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveOwner(null);
                                setReviewAction(null);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmReview}
                            disabled={submittingReview}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl text-white transition-colors flex items-center gap-2 disabled:opacity-50 ${
                                reviewAction === "approve"
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-amber-600 hover:bg-amber-700"
                            }`}
                        >
                            {submittingReview && (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {reviewAction === "approve"
                                ? "Approve Application"
                                : "Confirm Rejection"}
                        </button>
                    </div>
                </div>
            </AdminModal>

            {/* Delete Confirmation Modal */}
            <AdminConfirmModal
                isOpen={Boolean(ownerToDelete)}
                onClose={() => setOwnerToDelete(null)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                title="Delete Turf Owner"
                variant="danger"
                confirmText="Delete Partner"
                message={
                    ownerToDelete ? (
                        <div>
                            Are you sure you want to permanently delete{" "}
                            <strong className="text-gray-900">
                                {ownerToDelete.firstName} {ownerToDelete.lastName}
                            </strong>{" "}
                            ({ownerToDelete.businessName || "Turf Owner"}) and all their registered
                            facilities? This cannot be undone.
                        </div>
                    ) : null
                }
            />
        </div>
    );
}
