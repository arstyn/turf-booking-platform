import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { MapPin, Star, DollarSign, Calendar, Clock } from "lucide-react";

interface Turf {
    id: string;
    name: string;
    description: string;
    address: string;
    pricePerHour: number;
    amenities: string[];
    images: string[];
    availableSlots: string[];
    rating: number;
    totalReviews: number;
    contactPhone?: string;
    contactEmail?: string;
}

export default function TurfDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [turf, setTurf] = useState<Turf | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTurf();
        }
    }, [id]);

    const fetchTurf = async () => {
        try {
            const response = await api.get(`/turfs/${id}`);
            setTurf(response.data);
        } catch (error) {
            console.error("Failed to fetch turf:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!selectedDate || !selectedSlot) {
            alert("Please select a date and time slot");
            return;
        }

        const [startTime, endTime] = selectedSlot.split("-");
        setBooking(true);

        try {
            await api.post("/bookings", {
                turfId: id,
                bookingDate: selectedDate,
                startTime,
                endTime,
            });
            alert("Booking successful!");
            navigate("/dashboard/bookings");
        } catch (error: any) {
            alert(error.response?.data?.message || "Booking failed");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!turf) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Turf not found</div>
            </div>
        );
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {turf.images && turf.images.length > 0 ? (
                        <img
                            src={turf.images[0]}
                            alt={turf.name}
                            className="w-full h-96 object-cover"
                        />
                    ) : (
                        <div className="w-full h-96 bg-green-100 flex items-center justify-center">
                            <span className="text-8xl">⚽</span>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h1 className="text-4xl font-bold mb-4">
                                    {turf.name}
                                </h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{turf.address}</span>
                                </div>
                                <div className="flex items-center mb-6">
                                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                    <span className="font-semibold mr-2">
                                        {turf.rating > 0
                                            ? turf.rating.toFixed(1)
                                            : "New"}
                                    </span>
                                    {turf.totalReviews > 0 && (
                                        <span className="text-gray-500">
                                            ({turf.totalReviews} reviews)
                                        </span>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold mb-3">
                                        Description
                                    </h2>
                                    <p className="text-gray-700">
                                        {turf.description}
                                    </p>
                                </div>

                                {turf.amenities &&
                                    turf.amenities.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-semibold mb-3">
                                                Amenities
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
                                                {turf.amenities.map(
                                                    (amenity, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {turf.contactPhone && (
                                    <div className="mb-2">
                                        <strong>Phone:</strong>{" "}
                                        {turf.contactPhone}
                                    </div>
                                )}
                                {turf.contactEmail && (
                                    <div>
                                        <strong>Email:</strong>{" "}
                                        {turf.contactEmail}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-3xl font-bold text-green-600">
                                                ${turf.pricePerHour}
                                            </span>
                                            <span className="text-gray-600">
                                                per hour
                                            </span>
                                        </div>
                                    </div>

                                    {user && user.role === "user" ? (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-2">
                                                    Select Date
                                                </label>
                                                <input
                                                    type="date"
                                                    min={minDate}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500"
                                                    value={selectedDate}
                                                    onChange={(e) =>
                                                        setSelectedDate(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {selectedDate && (
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Select Time Slot
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                                        {turf.availableSlots.map(
                                                            (slot, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() =>
                                                                        setSelectedSlot(
                                                                            slot
                                                                        )
                                                                    }
                                                                    className={`px-3 py-2 rounded-md text-sm ${
                                                                        selectedSlot ===
                                                                        slot
                                                                            ? "bg-green-600 text-white"
                                                                            : "bg-white border border-gray-300 hover:border-green-500"
                                                                    }`}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleBooking}
                                                disabled={
                                                    !selectedDate ||
                                                    !selectedSlot ||
                                                    booking
                                                }
                                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {booking
                                                    ? "Booking..."
                                                    : "Book Now"}
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 text-center"
                                        >
                                            Login to Book
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
