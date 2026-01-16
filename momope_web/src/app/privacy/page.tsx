
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <a href="/" className="font-bold text-xl">MomoPe</a>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last Updated: January 16, 2026</p>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>
                        MomoPe Digital Hub Private Limited ("MomoPe", "we", "us", or "our") respects the privacy of our users ("user", "you").
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                        www.momope.com or use our mobile application.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">1. Collection of Data</h3>
                    <p>
                        We collect personal data that you voluntarily provide to us when registering with the Application, expressed interest
                        in obtaining information about us or our products and services, when participating in activities on the Application
                        or otherwise contacting us.
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Personal Data:</strong> Name, shipping address, email address, telephone number, and demographic information.</li>
                        <li><strong>Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) is processed by our secure payment processor (Razorpay). We do not store full credit card numbers.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">2. Use of Your Information</h3>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience.
                        Specifically, we may use information collected about you via the Application to:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Process payments and refunds.</li>
                        <li>Create and manage your account.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Protect against fraudulent transactions (in partnership with Razorpay).</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">3. Disclosure of Your Information</h3>
                    <p>
                        We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing (Razorpay), data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">4. Security of Your Information</h3>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information.
                        While we have taken reasonable steps to secure the personal information you provide to us, please be aware that
                        despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be
                        guaranteed against any interception or other type of misuse.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">5. Contact Us</h3>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at: <br />
                        <strong>Email:</strong> support@momope.com <br />
                        <strong>Address:</strong> MomoPe Digital Hub Private Limited, 4/106, Krishnapuram, YSR Kadapa, Andhra Pradesh – 516003, India.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
