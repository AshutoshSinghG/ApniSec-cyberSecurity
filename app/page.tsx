import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ApniSec - Cybersecurity Issue Management Platform',
    description: 'Professional cybersecurity issue management platform for Cloud Security, Red Team assessments, and VAPT. Streamline your security operations with ApniSec.',
    keywords: 'cybersecurity, issue management, cloud security, red team, VAPT, vulnerability assessment',
};

export default function Home() {
    return (
        <div className="min-h-screen bg-black">
            {/* Navbar */}
            <nav className="bg-cyber-gray border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-white">
                                apni <span className="text-primary">sec</span>
                            </span>
                            <span className="ml-2 text-xs text-gray-400">Security as a Service</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-300 hover:text-primary transition-colors font-semibold"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 text-black bg-primary rounded-md hover:bg-primary-dark transition-all duration-300 font-semibold"
                            >
                                Manage Now
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Streamline Your <span className="text-primary">Security Operations</span>
                        <br />
                        With Centralized Issue Management
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto">
                        Track, manage, and resolve cybersecurity issues across Cloud Security, Red Team assessments, and VAPT operations. Organize vulnerabilities, prioritize threats, and collaborate seamlessly with your security team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="px-8 py-4 text-lg font-semibold text-primary bg-transparent border-2 border-primary rounded-md hover:bg-primary hover:text-black transition-all duration-300"
                        >
                            View Demo
                        </Link>
                        <Link
                            href="/register"
                            className="px-8 py-4 text-lg font-semibold text-black bg-primary rounded-md hover:bg-primary-dark transition-all duration-300"
                        >
                            Start Managing Issues
                        </Link>
                    </div>
                    <p className="mt-8 text-gray-500">
                        <span className="text-primary font-bold">100+</span> Organizations <span className="text-white">Using ApniSec</span>
                    </p>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-4 bg-cyber-gray">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
                        Our Security Services
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Cloud Security */}
                        <div className="bg-black border border-primary/20 rounded-lg p-8 hover:border-primary transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 border border-primary rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Cloud Security</h3>
                            <p className="text-gray-400">
                                Comprehensive cloud infrastructure security assessments and continuous monitoring for AWS, Azure, and GCP environments.
                            </p>
                        </div>

                        {/* Red Team */}
                        <div className="bg-black border border-primary/20 rounded-lg p-8 hover:border-primary transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 border border-primary rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Red Team Assessment</h3>
                            <p className="text-gray-400">
                                Advanced adversary simulation and attack scenarios to test your organization's detection and response capabilities.
                            </p>
                        </div>

                        {/* VAPT */}
                        <div className="bg-black border border-primary/20 rounded-lg p-8 hover:border-primary transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 border border-primary rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">VAPT</h3>
                            <p className="text-gray-400">
                                Thorough vulnerability assessment and penetration testing to identify and remediate security weaknesses in your systems.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-cyber-gray border-t border-primary/20 py-8 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        &copy; 2025 ApniSec. All rights reserved. | Streamline your cybersecurity issue management.
                    </p>
                </div>
            </footer>
        </div>
    );
}
