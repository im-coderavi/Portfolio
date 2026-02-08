import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, Mail, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: Eye,
            title: "Information We Collect",
            content: [
                "We collect information that you provide directly to us when you contact us through our website forms or chatbot.",
                "Automatically collected information includes your IP address, browser type, device information, and pages visited through cookies and analytics tools.",
                "We use Google Analytics to understand how visitors interact with our website."
            ]
        },
        {
            icon: FileText,
            title: "How We Use Your Information",
            content: [
                "To respond to your inquiries and provide the services you request",
                "To improve our website and user experience",
                "To send you updates and marketing communications (with your consent)",
                "To comply with legal obligations and protect our rights"
            ]
        },
        {
            icon: Cookie,
            title: "Cookies and Tracking",
            content: [
                "We use cookies to enhance your browsing experience and analyze website traffic.",
                "Google Analytics: We use Google Analytics to track website usage and visitor behavior.",
                "Google AdSense: We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website.",
                "You can control cookies through your browser settings, but disabling them may affect website functionality."
            ]
        },
        {
            icon: Shield,
            title: "Third-Party Services",
            content: [
                "Google Analytics: Collects anonymous usage data to help us improve our website.",
                "Google AdSense: Displays personalized advertisements based on your interests.",
                "Cloudinary: Stores and delivers images on our website.",
                "These third-party services have their own privacy policies governing the use of your information."
            ]
        },
        {
            icon: Lock,
            title: "Data Security",
            content: [
                "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.",
                "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
                "We retain your information only as long as necessary to fulfill the purposes outlined in this policy."
            ]
        },
        {
            icon: Mail,
            title: "Your Rights",
            content: [
                "Access: You have the right to request access to the personal information we hold about you.",
                "Correction: You can request that we correct any inaccurate information.",
                "Deletion: You can request that we delete your personal information, subject to legal obligations.",
                "Opt-out: You can opt-out of marketing communications at any time.",
                "For GDPR compliance: EU residents have additional rights under the General Data Protection Regulation."
            ]
        }
    ];

    return (
        <>
            <Helmet>
                <title>Privacy Policy | Avishek Giri - Full Stack Developer</title>
                <meta name="description" content="Privacy Policy for coderavi.in - Learn how we collect, use, and protect your personal information." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://coderavi.in/privacy-policy" />
            </Helmet>

            <div className="min-h-screen bg-primary-dark text-white">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary-darker to-primary-dark border-b border-white/10">
                    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                        <Link
                            to="/"
                            className="inline-flex items-center text-accent-cyan hover:text-accent-blue mb-8 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-2xl flex items-center justify-center">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-display font-bold">
                                    Privacy <span className="text-gradient">Policy</span>
                                </h1>
                            </div>
                            <p className="text-text-secondary text-lg">
                                Last Updated: February 8, 2026
                            </p>
                            <p className="text-text-secondary mt-4 text-base">
                                At coderavi.in, we respect your privacy and are committed to protecting your personal information.
                                This Privacy Policy explains how we collect, use, and safeguard your data.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-accent-cyan/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-4 text-text-secondary">
                                    {section.content.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-accent-cyan mt-1.5 flex-shrink-0">•</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-accent-cyan/10 to-accent-blue/10 border border-accent-cyan/20 rounded-2xl p-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Contact Us
                            </h2>
                            <p className="text-text-secondary mb-4">
                                If you have any questions or concerns about this Privacy Policy or how we handle your data,
                                please contact us:
                            </p>
                            <div className="space-y-2 text-text-secondary">
                                <p>
                                    <strong className="text-white">Email:</strong>{' '}
                                    <a href="mailto:contact@coderavi.in" className="text-accent-cyan hover:text-accent-blue transition-colors">
                                        contact@coderavi.in
                                    </a>
                                </p>
                                <p>
                                    <strong className="text-white">Website:</strong>{' '}
                                    <a href="https://coderavi.in" className="text-accent-cyan hover:text-accent-blue transition-colors">
                                        coderavi.in
                                    </a>
                                </p>
                            </div>
                        </motion.div>

                        {/* Updates Notice */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-3">
                                Changes to This Policy
                            </h3>
                            <p className="text-text-secondary">
                                We may update this Privacy Policy from time to time. Any changes will be posted on this page
                                with an updated "Last Updated" date. We encourage you to review this policy periodically to
                                stay informed about how we protect your information.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="max-w-4xl mx-auto px-6 py-12 border-t border-white/10">
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-cyan to-accent-blue rounded-xl text-white font-medium hover:shadow-lg hover:shadow-accent-cyan/20 transition-all duration-300"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
