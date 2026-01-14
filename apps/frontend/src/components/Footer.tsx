import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    ⚽
                                </span>
                            </div>
                            <span className="text-xl font-bold">TurfBook</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your one-stop solution for booking football turfs.
                            Find and book the perfect turf for your game.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">For Users</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/register"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2 text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>support@turfbook.com</span>
                            </li>
                            <li className="flex items-center space-x-2 text-gray-400">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                        </ul>
                        <div className="flex space-x-4 mt-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 TurfBook. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
