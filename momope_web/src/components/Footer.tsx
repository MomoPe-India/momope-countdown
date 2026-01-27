import Link from 'next/link';
import { Shield, CheckCircle, Twitter, Linkedin, Globe, Facebook, Heart, Mail, Phone, MapPin, ArrowRight, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="download" className="bg-gray-50 pt-12 pb-6 border-t border-gray-200 relative overflow-hidden">
            {/* Decorative Top Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2CB78A]/50 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                    {/* Brand Column (Span 4) */}
                    <div className="lg:col-span-4 space-y-4 text-center md:text-left">
                        <Link href="/" className="inline-block">
                            <img src="/assets/logo-full.png" alt="MomoPe" className="h-9 w-auto mx-auto md:mx-0" />
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                            India's fastest-growing payment ecosystem. We bridge the gap between local commerce and digital convenience, offering secure payments, instant settlements, and a loyalty program that actually rewards.
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm">
                                <Shield size={12} className="text-[#2CB78A]" />
                                <span className="text-[10px] font-bold text-gray-700 tracking-wide">RBI COMPLIANT</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm">
                                <CheckCircle size={12} className="text-[#2CB78A]" />
                                <span className="text-[10px] font-bold text-gray-700 tracking-wide">PCI-DSS SECURE</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex gap-2.5 mb-6 justify-center md:justify-start">
                                <SocialLink href="https://www.facebook.com/MomoPe.india" icon={<Facebook size={16} />} label="Facebook" color="hover:bg-[#1877F2] hover:text-white" />
                                <SocialLink href="https://www.instagram.com/momope_india/" icon={<Instagram size={16} />} label="Instagram" color="hover:bg-gradient-to-tr hover:from-[#fd5949] hover:to-[#d6249f] hover:text-white" />
                                <SocialLink href="https://x.com/MomoPe_Deals/" icon={<Twitter size={16} />} label="Twitter" color="hover:bg-black hover:text-white" />
                                <SocialLink href="https://www.linkedin.com/company/momope/" icon={<Linkedin size={16} />} label="LinkedIn" color="hover:bg-[#0077b5] hover:text-white" />
                                <SocialLink href="https://www.momope.com/" icon={<Globe size={16} />} label="Website" color="hover:bg-[#2CB78A] hover:text-white" />
                            </div>


                            <div className="mt-6 flex flex-row gap-3 justify-center md:justify-start">
                                <a href="https://www.whatsapp.com/channel/0029VbBhoLk7z4kiZU9cBz1U" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/assets/app-store-badge.png"
                                        alt="Download on the App Store"
                                        className="h-[42px] w-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                                    />
                                </a>
                                <a href="https://www.whatsapp.com/channel/0029VbBhoLk7z4kiZU9cBz1U" target="_blank" rel="noopener noreferrer">
                                    <img
                                        src="/assets/google-play-badge.png"
                                        alt="Get it on Google Play"
                                        className="h-[42px] w-auto object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns (Span 4 combined for layout) */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8 text-center md:text-left">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 text-base">Company</h3>
                            <ul className="space-y-2.5 flex flex-col items-center md:items-start">
                                <FooterLink href="/" label="Home" />
                                <FooterLink href="/solutions" label="Solutions" />
                                <FooterLink href="/about" label="About Us" />
                                <FooterLink href="/careers" label="Careers" tag="Hiring" />
                                <FooterLink href="/contact" label="Contact Us" />
                                <FooterLink href="/admin/login" label="Partner Login" />
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 text-base">Legal</h3>
                            <ul className="space-y-2.5 flex flex-col items-center md:items-start">
                                <FooterLink href="/privacy" label="Privacy Policy" />
                                <FooterLink href="/terms" label="Terms of Service" />
                                <FooterLink href="/refund-policy" label="Refund Policy" />
                            </ul>
                        </div>
                    </div>

                    {/* Registered Office Column (Span 4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center justify-center md:justify-start gap-2">
                            <MapPin size={16} className="text-[#2CB78A]" />
                            Registered Office
                        </h3>
                        <div className="glass-card p-4 rounded-xl space-y-3 bg-white/80">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-900">MomoPe Digital Hub Pvt. Ltd.</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    #4/106 Krishnapuram,<br />
                                    YSR Kadapa,<br />
                                    Andhra Pradesh<br />
                                    India - 516003
                                </p>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={12} className="text-gray-500" />
                                    <a href="mailto:support@momope.com" className="text-gray-700 hover:text-[#2CB78A] transition-colors font-medium">
                                        support@momope.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={12} className="text-gray-500" />
                                    <a href="tel:+918639831132" className="text-gray-700 hover:text-[#2CB78A] transition-colors font-medium">
                                        +91 86398 31132
                                    </a>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Krishnapuram+YSR+Kadapa+Andhra+Pradesh+516003"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 text-sm font-bold py-2 px-3 bg-[#2CB78A] text-white rounded-lg hover:bg-[#249671] transition-colors shadow-sm"
                                >
                                    View on Map
                                    <ArrowRight size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>





                {/* Copyright Bar */}
                <div className="pt-6 border-t border-gray-200 mt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                        <p className="text-sm text-gray-600">
                            © {new Date().getFullYear()} <span className="font-bold text-gray-900">MomoPe Digital Hub Pvt. Ltd.</span> All rights reserved.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            Made with <Heart size={12} className="text-red-500 fill-red-500" /> in India
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Components
function FooterLink({ href, label, tag }: { href: string; label: string; tag?: string }) {
    return (
        <li>
            <Link href={href} className="text-sm text-gray-600 hover:text-[#2CB78A] transition-colors flex items-center gap-2 font-medium">
                {label}
                {tag && (
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold tracking-wide">
                        {tag}
                    </span>
                )}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 ${color} transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5`}
        >
            {icon}
        </a>
    );
}
