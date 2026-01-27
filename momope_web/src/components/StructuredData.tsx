import Script from 'next/script';

export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "MomoPe",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "operatingSystem": "Android, iOS",
        "description": "Pay at local shops and earn rewards on every transaction. Zero fees, instant settlement, real rewards.",
        "screenshot": "https://www.momope.in/hero-app-mockup.png",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "10000"
        },
        "provider": {
            "@type": "Organization",
            "name": "MomoPe Digital Hub Pvt. Ltd.",
            "url": "https://www.momope.in",
            "logo": "https://www.momope.in/logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8639831132",
                "contactType": "Customer Service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
                "https://twitter.com/MomoPe_Deals",
                "https://www.instagram.com/momope.deals/"
            ]
        }
    };

    return (
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
