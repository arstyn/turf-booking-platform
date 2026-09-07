import {
    ArrowUpDown,
    Check,
    Copy,
    Shield,
    Trash2,
    UserCheck,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    AdminBadge,
    AdminConfirmModal,
    AdminEmptyState,
    AdminFilterBar,
    AdminPageHeader,
    AdminPagination,
    AdminStatCard,
} from "../../components/admin";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface User {
    id: string;
    email?: string;
    phone?: string;
    firstName: string;
    lastName: string;
    role: "admin" | "user" | "turf_owner";
    createdAt: string;
}

export default function AdminUsers() {
    const { user: currentAdmin } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleTab, setRoleTab] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Delete Modal
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [actionFeedback, setActionFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            setUsers(res.data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            showFeedback("error", "Failed to fetch user directory.");
        } finally {
            setLoading(false);
        }
    };

    const showFeedback = (type: "success" | "error", text: string) => {
        setActionFeedback({ type, text });
        setTimeout(() => setActionFeedback(null), 3500);
    };

    const handleUpdateUserRole = async (
        targetUser: User,
        newRole: User["role"],
    ) => {
        if (targetUser.role === newRole) return;
        if (currentAdmin && targetUser.id === currentAdmin.id && newRole !== "admin") {
            showFeedback("error", "You cannot demote your own active admin account.");
            return;
        }
        try {
            await api.patch(`/users/${targetUser.id}`, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)),
            );
            showFeedback(
                "success",
                `Updated ${targetUser.firstName}'s role to ${newRole.replace("_", " ")}.`,
            );
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showFeedback(
                "error",
                err.response?.data?.message || "Failed to update user role",
            );
        }
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        if (currentAdmin && userToDelete.id === currentAdmin.id) {
            showFeedback("error", "You cannot delete your own account.");
            setUserToDelete(null);
            return;
        }

        try {
            setDeleting(true);
            await api.delete(`/users/${userToDelete.id}`);
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            showFeedback(
                "success",
                `User ${userToDelete.firstName} ${userToDelete.lastName} deleted.`,
            );
            setUserToDelete(null);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showFeedback(
                "error",
                err.response?.data?.message || "Failed to delete user",
            );
        } finally {
            setDeleting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedEmail(text);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    // User counts
    const userCounts = useMemo(() => {
        const counts = { all: users.length, user: 0, turf_owner: 0, admin: 0 };
        users.forEach((u) => {
            if (counts[u.role] !== undefined) counts[u.role]++;
        });
        return counts;
    }, [users]);

    // Filter & Sort
    const filteredUsers = useMemo(() => {
        let list = [...users];

        if (roleTab !== "all") {
            list = list.filter((u) => u.role === roleTab);
        }

        if (search.trim()) {
            const term = search.toLowerCase();
            list = list.filter((u) => {
                const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
                return (
                    fullName.includes(term) ||
                    (u.email && u.email.toLowerCase().includes(term)) ||
                    (u.phone && u.phone.toLowerCase().includes(term))
                );
            });
        }

        list.sort((a, b) => {
            if (sortBy === "name") {
                return a.firstName.localeCompare(b.firstName);
            }
            if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return list;
    }, [users, roleTab, search, sortBy]);

    // Pagination slice
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, currentPage, pageSize]);

    return (
        <div className="w-full p-5 space-y-6 animate-in fade-in duration-300">
            <AdminPageHeader
                title="Platform Users"
                description="Manage customer accounts, business turf owners, and admin permissions"
                badge={`${users.length} Total`}
            />

            {/* Notification alert banner */}
            {actionFeedback && (
                <div
                    className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in duration-200 ${
                        actionFeedback.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                >
                    <span>{actionFeedback.text}</span>
                    <button
                        onClick={() => setActionFeedback(null)}
                        className="text-xs opacity-75 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Top Stat Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <AdminStatCard
                    title="Total Accounts"
                    value={userCounts.all}
                    icon={Users}
                    iconColor="text-gray-700"
                    iconBg="bg-gray-100"
                />
                <AdminStatCard
                    title="Regular Users"
                    value={userCounts.user}
                    icon={Users}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                />
                <AdminStatCard
                    title="Turf Owners"
                    value={userCounts.turf_owner}
                    icon={UserCheck}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                />
                <AdminStatCard
                    title="Admins"
                    value={userCounts.admin}
                    icon={Shield}
                    iconColor="text-purple-600"
                    iconBg="bg-purple-50"
                />
            </div>

            {/* Filters Toolbar */}
            <AdminFilterBar
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setCurrentPage(1);
                }}
                searchPlaceholder="Search by name, email, or phone..."
                tabs={[
                    { id: "all", label: "All Roles", count: userCounts.all },
                    { id: "user", label: "Users", count: userCounts.user },
                    { id: "turf_owner", label: "Turf Owners", count: userCounts.turf_owner },
                    { id: "admin", label: "Admins", count: userCounts.admin },
                ]}
                activeTab={roleTab}
                onTabChange={(tab) => {
                    setRoleTab(tab);
                    setCurrentPage(1);
                }}
                hasActiveFilters={Boolean(search || roleTab !== "all" || sortBy !== "newest")}
                onResetFilters={() => {
                    setSearch("");
                    setRoleTab("all");
                    setSortBy("newest");
                    setCurrentPage(1);
                }}
                rightSlot={
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value as "newest" | "oldest" | "name",
                                )
                            }
                            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-200"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                }
            />

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 text-sm animate-pulse">
                        Loading platform users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <AdminEmptyState
                        title="No users match your criteria"
                        description="Try modifying your role filter or search term."
                        onResetFilters={() => {
                            setSearch("");
                            setRoleTab("all");
                        }}
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-3 px-5">User</th>
                                        <th className="py-3 px-5">Contact Details</th>
                                        <th className="py-3 px-5">Role Permission</th>
                                        <th className="py-3 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                                    {paginatedUsers.map((u) => {
                                        const initials = `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();
                                        const isSelf = currentAdmin?.id === u.id;

                                        return (
                                            <tr
                                                key={u.id}
                                                className="hover:bg-gray-50/70 transition-colors"
                                            >
                                                {/* User Info */}
                                                <td className="py-3.5 px-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-red-100/70 border border-red-200 text-[#E33E33] font-bold text-xs flex items-center justify-center shrink-0">
                                                            {initials || "U"}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                                                <span>
                                                                    {u.firstName} {u.lastName}
                                                                </span>
                                                                {isSelf && (
                                                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-semibold">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                                Joined{" "}
                                                                {new Date(
                                                                    u.createdAt,
                                                                ).toLocaleDateString("en-IN", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Details */}
                                                <td className="py-3.5 px-5">
                                                    <div className="space-y-0.5">
                                                        {u.email ? (
                                                            <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                                                                <span>{u.email}</span>
                                                                <button
                                                                    onClick={() =>
                                                                        copyToClipboard(u.email!)
                                                                    }
                                                                    className="text-gray-400 hover:text-gray-600 p-0.5"
                                                                    title="Copy email"
                                                                >
                                                                    {copiedEmail === u.email ? (
                                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                                    ) : (
                                                                        <Copy className="w-3 h-3" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">
                                                                No email provided
                                                            </span>
                                                        )}
                                                        {u.phone && (
                                                            <p className="text-[11px] text-gray-500 font-mono">
                                                                {u.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Role Permission */}
                                                <td className="py-3.5 px-5">
                                                    <div className="flex items-center gap-2">
                                                        <AdminBadge status={u.role} />
                                                        <select
                                                            value={u.role}
                                                            disabled={isSelf}
                                                            onChange={(e) =>
                                                                handleUpdateUserRole(
                                                                    u,
                                                                    e.target.value as User["role"],
                                                                )
                                                            }
                                                            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                                            title={
                                                                isSelf
                                                                    ? "Cannot alter own role"
                                                                    : "Change role"
                                                            }
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="turf_owner">
                                                                Turf Owner
                                                            </option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-5 text-right">
                                                    <button
                                                        onClick={() => setUserToDelete(u)}
                                                        disabled={isSelf}
                                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title={
                                                            isSelf
                                                                ? "Cannot delete your own account"
                                                                : "Delete User"
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <AdminPagination
                            currentPage={currentPage}
                            totalItems={filteredUsers.length}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AdminConfirmModal
                isOpen={Boolean(userToDelete)}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleConfirmDelete}
                loading={deleting}
                title="Delete User Account"
                variant="danger"
                confirmText="Delete Account"
                message={
                    userToDelete ? (
                        <div>
                            Are you sure you want to permanently delete{" "}
                            <strong className="text-gray-900">
                                {userToDelete.firstName} {userToDelete.lastName}
                            </strong>{" "}
                            ({userToDelete.email || userToDelete.phone})? This will revoke access
                            and delete their profile.
                        </div>
                    ) : null
                }
            />
        </div>
    );
}
