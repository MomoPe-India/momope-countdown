import LegalLayout from '@/components/LegalLayout';

export default function RefundPolicy() {
    return (
        <LegalLayout title="Refund & Cancellation Policy" lastUpdated="January 16, 2026">
            <p>
                At MomoPe, we strive to ensure seamless transactions between merchants and customers. However, we understand that issues may arise.
                This policy outlines the circumstances under which refunds and cancellations are processed.
            </p>

            <h3>1. Merchant Transactions</h3>
            <p>
                MomoPe acts as a payment facilitator. If a customer has made a payment to a merchant for goods or services and wishes to
                cancel the order or request a refund, the customer must contact the merchant directly.
                <strong>MomoPe does not have the authority to issue refunds on behalf of merchants</strong> without the merchant's consent,
                unless there is a technical failure in the transaction.
            </p>

            <h3>2. Technical Failures (Double Debits)</h3>
            <p>
                If a transaction fails but the amount is debited from the user's account, the amount is usually auto-refunded by the
                source bank within 3-5 business days. If the refund is not received within this period, users can raise a ticket
                with our support team. We will coordinate with Razorpay (our payment partner) and the bank to expedite the refund.
            </p>

            <h3>3. Suspicious or Fraudulent Transactions</h3>
            <p>
                If we detect any fraudulent activity associated with a transaction, MomoPe reserves the right to cancel the transaction
                and refund the amount to the source account. Users may be asked to provide verification documents in such cases.
            </p>

            <h3>4. Platform Fees</h3>
            <p>
                Any subscription fees or platform charges paid directly to MomoPe (e.g., for premium merchant features) are generally
                non-refundable. However, exceptions may be made on a case-by-case basis if a cancellation request is made within 24 hours
                of purchase and the service has not been utilized.
            </p>

            <h3>5. Contact Us</h3>
            <p>
                For any disputes or refund related queries, please contact our support team:<br />
                <strong>Email:</strong> support@momope.com<br />
                <strong>Phone:</strong> +91 8639831132
            </p>
        </LegalLayout>
    );
}
