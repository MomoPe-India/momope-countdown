import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 text-[#131B26] font-sans">
            {/* Reusing the Main Navbar for consistency */}
            <Navbar />

            {/* Premium Header Section */}
            <div className="bg-[#131B26] text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2CB78A]/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{title}</h1>
                    <p className="text-gray-400 font-medium tracking-wide upppercase text-xs">Last Updated: {lastUpdated}</p>
                </div>
            </div>

            {/* Content Container */}
            <main className="container mx-auto px-6 py-16 max-w-4xl relative -mt-10">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="prose prose-lg prose-headings:font-bold prose-headings:text-[#131B26] prose-p:text-gray-600 prose-a:text-[#2CB78A] max-w-none">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
