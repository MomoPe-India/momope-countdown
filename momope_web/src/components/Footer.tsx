
import Link from 'next/link';
import { Shield, CheckCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#131B26] text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: Logo & Company Description */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            MomoPe is a technology platform that helps merchants accept payments and build customer loyalty.
                            We are not a bank. Banking services are provided by our RBI-licensed banking partners.
                            All payments are processed via Razorpay (PCI-DSS Compliant).
                        </p>
                        <div className="mt-6 flex gap-4 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            <span className="flex items-center gap-1"><Shield size={12} /> RBI Compliant</span>
                            <span className="flex items-center gap-1"><CheckCircle size={12} /> 100% Secure</span>
                        </div>
                    </div>

                    {/* Column 2: Company Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/" className="hover:text-[#2CB78A] transition">Home</Link></li>
                            <li><Link href="/about" className="hover:text-[#2CB78A] transition">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-[#2CB78A] transition">Contact Support</Link></li>
                            <li><Link href="/admin" className="hover:text-[#2CB78A] transition">Merchant Login</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Legal</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/privacy" className="hover:text-[#2CB78A] transition">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#2CB78A] transition">Terms of Use</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-[#2CB78A] transition">Refund/Cancellation</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Registered Address & Copyright */}
                    <div className="text-sm text-gray-400">
                        <h3 className="font-bold text-lg mb-4 text-white">Registered Office</h3>
                        <p className="font-semibold text-white mb-2">MomoPe Digital Hub Private Limited</p>
                        <p className="mb-4 text-gray-500 leading-relaxed">
                            4/106, Krishnapuram,<br />
                            YSR Kadapa, Andhra Pradesh<br />
                            516003, India
                        </p>
                        <div className="space-y-1 text-xs text-gray-600 mb-6">
                            <p>CIN: U72900KA2026PTC123456</p>
                            <p>Support: support@momope.com</p>
                            <p>Phone: +91 8639831132</p>
                        </div>
                        <p className="text-xs text-gray-700">© 2026 MomoPe. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
