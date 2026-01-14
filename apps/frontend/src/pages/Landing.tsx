import { Link } from "react-router-dom";
import { Search, Calendar, Star, Shield, Clock, MapPin } from "lucide-react";

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Book Your Perfect Football Turf
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-green-100">
                            Find and book the best football turfs in your area.
                            Easy, fast, and reliable.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition text-lg"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/turfs"
                                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition text-lg"
                            >
                                Browse Turfs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        Why Choose TurfBook?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Easy Search
                            </h3>
                            <p className="text-gray-600">
                                Find the perfect turf near you with our advanced
                                search and filter options.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Instant Booking
                            </h3>
                            <p className="text-gray-600">
                                Book your preferred time slot instantly with
                                real-time availability.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">
                                Secure & Reliable
                            </h3>
                            <p className="text-gray-600">
                                Your bookings are secure with our trusted
                                payment and booking system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                Sign Up
                            </h3>
                            <p className="text-gray-600">
                                Create your account in seconds
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                Search Turfs
                            </h3>
                            <p className="text-gray-600">
                                Browse available turfs in your area
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                Book & Play
                            </h3>
                            <p className="text-gray-600">
                                Select your time slot and confirm
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                4
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                Enjoy
                            </h3>
                            <p className="text-gray-600">
                                Show up and enjoy your game!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-green-100">Turfs Listed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-green-100">Happy Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-green-100">Bookings Made</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">4.8</div>
                            <div className="text-green-100">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of players who trust TurfBook for their
                        turf bookings.
                    </p>
                    <Link
                        to="/register"
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg inline-block"
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>
        </div>
    );
}
