import {
    AlertCircle,
    ArrowUpRight,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    RefreshCw,
    ShieldAlert,
    TrendingUp,
    UserCheck,
    Users,
    Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    AdminPageHeader,
    AdminStatCard,
} from "../../components/admin";
import api from "../../services/api";
import type { AdminOverviewData, Statistics } from "./types";

export default function AdminOverview() {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [overview, setOverview] = useState<AdminOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const [statsRes, overviewRes] = await Promise.all([
                api.get("/users/statistics"),
                api.get("/dashboard/admin-overview"),
            ]);
            setStatistics(statsRes.data);
            setOverview(overviewRes.data);
        } catch (error) {
            console.error("Failed to fetch overview data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full p-5 space-y-6">
                <div className="h-10 bg-gray-200/70 rounded-xl animate-pulse w-64" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-28 bg-gray-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 h-72 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    if (!statistics || !overview) return null;

    const approvalRate =
        statistics.totalTurfOwners > 0
            ? Math.round(
                  (statistics.approvedTurfOwners / statistics.totalTurfOwners) *
                      100,
              )
            : 0;

    return (
        <div className="w-full p-5 space-y-6 animate-in fade-in duration-300">
            <AdminPageHeader
                title="Admin Overview"
                description="Real-time platform financial KPIs, bookings volume, and system alerts"
                badge="Executive Dashboard"
                actions={
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#E33E33]" : ""}`}
                        />
                        <span>{refreshing ? "Updating..." : "Refresh Data"}</span>
                    </button>
                }
            />

            {/* Operational Alerts banner if any pending or alerts exist */}
            {(overview.alerts.payoutsRequested > 0 ||
                overview.alerts.failedPayments24h > 0 ||
                statistics.pendingApprovals > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {overview.alerts.payoutsRequested > 0 && (
                        <Link
                            to="/admin/payments"
                            className="flex items-center justify-between p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl hover:bg-amber-100/70 transition-colors group"
                        >
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-amber-900">
                                        Payouts Awaiting Review
                                    </p>
                                    <p className="text-[11px] text-amber-700">
                                        {overview.alerts.payoutsRequested} requests pending
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    )}

                    {statistics.pendingApprovals > 0 && (
                        <Link
                            to="/admin/owners"
                            className="flex items-center justify-between p-3.5 bg-sky-50/80 border border-sky-200/80 rounded-xl hover:bg-sky-100/70 transition-colors group"
                        >
                            <div className="flex items-center gap-2.5">
                                <UserCheck className="w-5 h-5 text-sky-600 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-sky-900">
                                        Owner Approvals
                                    </p>
                                    <p className="text-[11px] text-sky-700">
                                        {statistics.pendingApprovals} turf owners awaiting approval
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-sky-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    )}

                    {overview.alerts.failedPayments24h > 0 && (
                        <Link
                            to="/admin/payments"
                            className="flex items-center justify-between p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-xl hover:bg-rose-100/70 transition-colors group"
                        >
                            <div className="flex items-center gap-2.5">
                                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-rose-900">
                                        Failed Transactions (24h)
                                    </p>
                                    <p className="text-[11px] text-rose-700">
                                        {overview.alerts.failedPayments24h} transactions failed
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-rose-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    )}
                </div>
            )}

            {/* Financial Performance KPIs */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Financial Performance
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">INR Currency</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AdminStatCard
                        title="Today's Revenue"
                        value={`₹${overview.revenue.today.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                        icon={CreditCard}
                        iconColor="text-emerald-600"
                        iconBg="bg-emerald-50"
                        description="Direct turf booking volume"
                    />
                    <AdminStatCard
                        title="7-Day Revenue"
                        value={`₹${overview.revenue.last7Days.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                        icon={TrendingUp}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                        trend={{ value: "Last 7 Days", isPositive: true }}
                    />
                    <AdminStatCard
                        title="30-Day Revenue"
                        value={`₹${overview.revenue.last30Days.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                        icon={TrendingUp}
                        iconColor="text-indigo-600"
                        iconBg="bg-indigo-50"
                        trend={{ value: "Trailing month", isPositive: true }}
                    />
                    <AdminStatCard
                        title="Wallet Liability"
                        value={`₹${overview.wallet.totalLiability.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                        icon={Wallet}
                        iconColor="text-amber-600"
                        iconBg="bg-amber-50"
                        description="Outstanding owner balances"
                    />
                </div>
            </div>

            {/* Platform Users & Turf Ecosystem */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#E33E33]" />
                        User & Business Ecosystem
                    </h2>
                    <Link
                        to="/admin/users"
                        className="text-xs font-semibold text-[#E33E33] hover:underline flex items-center gap-1"
                    >
                        View all users <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <AdminStatCard
                        title="Total Users"
                        value={statistics.totalUsers}
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                        description="All platform accounts"
                    />
                    <AdminStatCard
                        title="Turf Owners"
                        value={statistics.totalTurfOwners}
                        icon={UserCheck}
                        iconColor="text-indigo-600"
                        iconBg="bg-indigo-50"
                        description="Registered partners"
                    />
                    <AdminStatCard
                        title="Approved Owners"
                        value={statistics.approvedTurfOwners}
                        icon={CheckCircle2}
                        iconColor="text-emerald-600"
                        iconBg="bg-emerald-50"
                        trend={{ value: `${approvalRate}% approved`, isPositive: true }}
                    />
                    <AdminStatCard
                        title="Pending Approvals"
                        value={statistics.pendingApprovals}
                        icon={AlertCircle}
                        iconColor="text-amber-600"
                        iconBg="bg-amber-50"
                        trend={{
                            value: statistics.pendingApprovals > 0 ? "Action required" : "Clear",
                            isPositive: statistics.pendingApprovals === 0,
                        }}
                    />
                    <AdminStatCard
                        title="Platform Admins"
                        value={statistics.totalAdmins}
                        icon={ShieldAlert}
                        iconColor="text-purple-600"
                        iconBg="bg-purple-50"
                        description="System administrators"
                    />
                </div>
            </div>

            {/* Bookings & Top Turfs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bookings Performance */}
                <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#E33E33]" />
                                Bookings Pulse
                            </h3>
                            <Link
                                to="/admin/bookings"
                                className="text-xs font-semibold text-[#E33E33] hover:underline"
                            >
                                All Bookings →
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-5">
                            <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase">
                                    Today
                                </p>
                                <p className="text-xl font-black text-gray-900 mt-1">
                                    {overview.bookings.today}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase">
                                    7 Days
                                </p>
                                <p className="text-xl font-black text-gray-900 mt-1">
                                    {overview.bookings.last7Days}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase">
                                    30 Days
                                </p>
                                <p className="text-xl font-black text-gray-900 mt-1">
                                    {overview.bookings.last30Days}
                                </p>
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="space-y-2.5">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                All-Time Status Breakdown
                            </p>
                            <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-lg text-xs font-semibold border border-emerald-100">
                                <span className="flex items-center gap-2 text-emerald-800">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Confirmed
                                </span>
                                <span className="font-bold text-emerald-900">
                                    {overview.bookings.confirmed}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-sky-50/50 rounded-lg text-xs font-semibold border border-sky-100">
                                <span className="flex items-center gap-2 text-sky-800">
                                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                                    Completed
                                </span>
                                <span className="font-bold text-sky-900">
                                    {overview.bookings.completed}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-lg text-xs font-semibold border border-amber-100">
                                <span className="flex items-center gap-2 text-amber-800">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    Pending
                                </span>
                                <span className="font-bold text-amber-900">
                                    {overview.bookings.pending}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-lg text-xs font-semibold border border-rose-100">
                                <span className="flex items-center gap-2 text-rose-800">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    Cancelled
                                </span>
                                <span className="font-bold text-rose-900">
                                    {overview.bookings.cancelled}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Turfs Leaderboard */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                Top Performing Turfs by Revenue
                            </h3>
                            <Link
                                to="/admin/turfs"
                                className="text-xs font-semibold text-[#E33E33] hover:underline"
                            >
                                View All Turfs →
                            </Link>
                        </div>

                        {overview.topTurfsByRevenue &&
                        overview.topTurfsByRevenue.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                            <th className="pb-3 pr-2 w-10">#</th>
                                            <th className="pb-3 pr-4">Turf Name</th>
                                            <th className="pb-3 pr-4">Owner</th>
                                            <th className="pb-3 pr-4 text-center">Bookings</th>
                                            <th className="pb-3 text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {overview.topTurfsByRevenue.map((turf, idx) => (
                                            <tr
                                                key={turf.turfId}
                                                className="hover:bg-gray-50/60 transition-colors"
                                            >
                                                <td className="py-3 pr-2 font-bold text-gray-400">
                                                    {idx === 0 ? (
                                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center justify-center text-xs font-bold">
                                                            1
                                                        </span>
                                                    ) : idx === 1 ? (
                                                        <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 inline-flex items-center justify-center text-xs font-bold">
                                                            2
                                                        </span>
                                                    ) : idx === 2 ? (
                                                        <span className="w-5 h-5 rounded-full bg-amber-700/20 text-amber-900 inline-flex items-center justify-center text-xs font-bold">
                                                            3
                                                        </span>
                                                    ) : (
                                                        `#${idx + 1}`
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 font-semibold text-gray-900">
                                                    {turf.turfName}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500 font-medium">
                                                    {turf.ownerName || "Partner"}
                                                </td>
                                                <td className="py-3 pr-4 text-center font-bold text-gray-700">
                                                    {turf.bookings}
                                                </td>
                                                <td className="py-3 text-right font-black text-emerald-600">
                                                    ₹
                                                    {turf.revenue.toLocaleString("en-IN", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400 text-xs">
                                No turf revenue data recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
