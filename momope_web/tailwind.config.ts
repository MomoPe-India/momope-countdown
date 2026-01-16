import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    primary: "#2CB78A",    // MomoPe Green
                    dark: "#131B26",       // MomoPe Dark
                    accent: "#059669",     // Darker Green for hover
                }
            },
        },
    },
    plugins: [],
};
export default config;
