
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <a href="/" className="font-bold text-xl">MomoPe</a>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
                    <p className="text-gray-500 mb-12 text-lg">
                        We are here to help. Reach out to us for any questions about our platform, payments, or your account.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2CB78A]">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Email Us</h3>
                            <p className="text-gray-500 mb-4">For general queries and support</p>
                            <a href="mailto:support@momope.com" className="text-[#2CB78A] font-bold hover:underline">support@momope.com</a>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Call Us</h3>
                            <p className="text-gray-500 mb-4">Mon-Fri, 9am - 6pm IST</p>
                            <a href="tel:+918639831132" className="text-blue-600 font-bold hover:underline">+91 8639831132</a>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                                <MapPin size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                            <p className="text-gray-500">
                                MomoPe Digital Hub Pvt Ltd<br />
                                4/106, Krishnapuram, YSR Kadapa<br />
                                Andhra Pradesh – 516003, India
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-xl mb-4 text-blue-900">Merchant Support</h3>
                        <p className="text-blue-800 mb-4">
                            Are you a registered merchant? For faster resolution, please raise a ticket directly from your MomoPe Business App dashboard.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
