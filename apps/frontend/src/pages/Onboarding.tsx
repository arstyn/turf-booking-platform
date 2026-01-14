import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Onboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [userData, setUserData] = useState({
        phone: "",
        dateOfBirth: "",
        address: "",
    });

    const [ownerData, setOwnerData] = useState({
        businessName: "",
        businessAddress: "",
        businessPhone: "",
        businessDescription: "",
        taxId: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.onboardingStatus === "completed") {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/onboarding/user", userData);
            navigate("/dashboard");
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to complete onboarding"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOwnerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/onboarding/turf-owner", ownerData);
            navigate("/dashboard");
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to complete onboarding"
            );
        } finally {
            setLoading(false);
        }
    };

    if (user.role === "user") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Complete Your Profile
                    </h2>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                value={userData.phone}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                value={userData.dateOfBirth}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        dateOfBirth: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                rows={3}
                                value={userData.address}
                                onChange={(e) =>
                                    setUserData({
                                        ...userData,
                                        address: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Complete Profile"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (user.role === "turf_owner") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Business Information
                    </h2>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleOwnerSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                value={ownerData.businessName}
                                onChange={(e) =>
                                    setOwnerData({
                                        ...ownerData,
                                        businessName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Address *
                            </label>
                            <textarea
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                rows={3}
                                value={ownerData.businessAddress}
                                onChange={(e) =>
                                    setOwnerData({
                                        ...ownerData,
                                        businessAddress: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Phone *
                            </label>
                            <input
                                type="tel"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                value={ownerData.businessPhone}
                                onChange={(e) =>
                                    setOwnerData({
                                        ...ownerData,
                                        businessPhone: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Business Description
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                rows={3}
                                value={ownerData.businessDescription}
                                onChange={(e) =>
                                    setOwnerData({
                                        ...ownerData,
                                        businessDescription: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tax ID
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                value={ownerData.taxId}
                                onChange={(e) =>
                                    setOwnerData({
                                        ...ownerData,
                                        taxId: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Complete Setup"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
}
