import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ApniSec - Cybersecurity Issue Management",
    description: "Professional cybersecurity issue management platform for Cloud Security, Red Team, and VAPT assessments",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
