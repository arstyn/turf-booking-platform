import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Plus, Edit, Trash2, MapPin, DollarSign } from "lucide-react";

interface Turf {
    id: string;
    name: string;
    description: string;
    address: string;
    pricePerHour: number;
    isActive: boolean;
}

export default function TurfOwnerDashboard() {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        pricePerHour: "",
        amenities: "",
        availableSlots: "",
    });

    useEffect(() => {
        fetchTurfs();
    }, []);

    const fetchTurfs = async () => {
        try {
            const response = await api.get("/turfs/my-turfs");
            setTurfs(response.data);
        } catch (error) {
            console.error("Failed to fetch turfs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const turfData = {
                ...formData,
                pricePerHour: parseFloat(formData.pricePerHour),
                amenities: formData.amenities
                    .split(",")
                    .map((a) => a.trim())
                    .filter(Boolean),
                availableSlots: formData.availableSlots
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            };
            await api.post("/turfs", turfData);
            setShowForm(false);
            setFormData({
                name: "",
                description: "",
                address: "",
                pricePerHour: "",
                amenities: "",
                availableSlots: "",
            });
            fetchTurfs();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to create turf");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this turf?")) return;
        try {
            await api.delete(`/turfs/${id}`);
            fetchTurfs();
        } catch (error) {
            alert("Failed to delete turf");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        My Turfs
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Turf
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Add New Turf
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Turf Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Price per Hour ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                        value={formData.pricePerHour}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pricePerHour: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Amenities (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Parking, Changing Room, Water"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                    value={formData.amenities}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            amenities: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Available Slots (comma-separated, e.g.,
                                    06:00-07:00, 07:00-08:00)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="06:00-07:00, 07:00-08:00, 08:00-09:00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                    value={formData.availableSlots}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            availableSlots: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Create Turf
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {turfs.map((turf) => (
                        <div
                            key={turf.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="h-48 bg-green-100 flex items-center justify-center">
                                <span className="text-6xl">⚽</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {turf.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {turf.description}
                                </p>
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="truncate">
                                        {turf.address}
                                    </span>
                                </div>
                                <div className="flex items-center text-green-600 font-semibold mb-4">
                                    <DollarSign className="w-4 h-4" />
                                    <span>${turf.pricePerHour}/hr</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(turf.id)}
                                        className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {turfs.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <p className="text-gray-500 text-lg mb-4">
                            No turfs yet. Create your first turf!
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                        >
                            Add Turf
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
