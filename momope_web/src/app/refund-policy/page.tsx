
import Footer from '@/components/Footer';

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <a href="/" className="font-bold text-xl">MomoPe</a>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
                <p className="text-gray-500 mb-8">Last Updated: January 16, 2026</p>

                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>
                        At MomoPe Digital Hub Private Limited, our goal is to ensure your complete satisfaction. However, we understand that
                        issues may arise. This policy outlines how refunds and cancellations are handled for transactions made via our platform.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">1. Merchant Transactions</h3>
                    <p>
                        MomoPe acts as a technology platform facilitating payments between customers and merchants.
                        For disputes regarding goods or services purchased from a merchant using MomoPe:
                    </p>
                    <ul className="list-disc pl-6">
                        <li><strong>Direct Resolution:</strong> Customers are encouraged to first contact the merchant directly to resolve any issues with the product or service.</li>
                        <li><strong>Refund Initiation:</strong> Merchants can initiate full or partial refunds directly from their MomoPe Business Dashboard. Refunds are processed back to the original payment method within 5-7 business days.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">2. Platform Fees</h3>
                    <p>
                        Transaction fees or platform fees charged by MomoPe are generally non-refundable unless the transaction was due to a technical error on our part.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">3. Technical Issues</h3>
                    <p>
                        If a transaction fails but money is deducted from your account, the amount is usually auto-refunded by the banking network within 48-72 hours.
                        If you do not receive the refund within this timeframe, please contact our support team with the Transaction ID.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">4. Cancellation Policy</h3>
                    <p>
                        <strong>For Merchants:</strong> You may deactivate your MomoPe merchant account at any time by contacting support. Any pending settlements will be cleared to your registered bank account before closure. <br />
                        <strong>For Customers:</strong> You may delete your MomoPe account via the app settings.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-8">5. Contact Support</h3>
                    <p>
                        For any payment-related issues that cannot be resolved with the merchant, please contact us:<br />
                        <strong>Email:</strong> support@momope.com<br />
                        <strong>Phone:</strong> +91 8639831132
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
