
import Footer from '@/components/Footer';

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <a href="/" className="font-bold text-xl">MomoPe</a>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
                <p className="text-gray-500 mb-8">Last Updated: January 16, 2026</p>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>
                        Welcome to MomoPe. These Terms of Use constitute a legally binding agreement made between you, whether personally or
                        on behalf of an entity (“you”) and MomoPe Digital Hub Private Limited (“Company”, “we”, “us”, or “our”), concerning
                        your access to and use of the momope.com website as well as any other media form, media channel, mobile website
                        or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">1. Agreement to Terms</h3>
                    <p>
                        By accessing the Site, you represent that you have read, understood, and agreed to be bound by all of these Terms of Use.
                        IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST
                        DISCONTINUE USE IMMEDIATELY.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">2. Intellectual Property Rights</h3>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software,
                        website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks,
                        service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected
                        by copyright and trademark laws.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">3. User Representations</h3>
                    <p>
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate,
                        current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration
                        information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use; (4) you are
                        not under the age of 18; (5) you will not access the Site through automated or non-human means, whether through a bot,
                        script or otherwise; (6) you will not use the Site for any illegal or unauthorized purpose; and (7) your use of the
                        Site will not violate any applicable law or regulation.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">4. Prohibited Activities</h3>
                    <p>
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may
                        not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">5. Governing Law</h3>
                    <p>
                        These Terms shall be governed by and defined following the laws of India. MomoPe Digital Hub Private Limited and yourself
                        irrevocably consent that the courts of Bangalore, Karnataka shall have exclusive jurisdiction to resolve any dispute
                        which may arise in connection with these terms.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">6. Contact Us</h3>
                    <p>
                        MomoPe Digital Hub Private Limited<br />
                        4/106, Krishnapuram, YSR Kadapa, Andhra Pradesh – 516003, India.<br />
                        support@momope.com
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
