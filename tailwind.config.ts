import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: '#00FF9D',
                    dark: '#00CC7E',
                    light: '#33FFB3',
                },
                cyber: {
                    green: '#00FF9D',
                    dark: '#0A0A0A',
                    gray: '#1A1A1A',
                },
            },
        },
    },
    plugins: [],
};
export default config;
