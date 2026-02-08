import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, Ban, DollarSign, UserX } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            icon: FileText,
            title: "Acceptance of Terms",
            content: [
                "By accessing and using coderavi.in (the 'Website'), you accept and agree to be bound by these Terms of Service.",
                "If you do not agree to these terms, please do not use this Website.",
                "We reserve the right to modify these terms at any time. Continued use of the Website constitutes acceptance of the modified terms."
            ]
        },
        {
            icon: UserX,
            title: "Use of Website",
            content: [
                "This Website is intended to showcase professional portfolio, projects, and services offered by Avishek Giri.",
                "You may use this Website for lawful purposes only and in accordance with these Terms.",
                "You agree not to use the Website in any way that could damage, disable, or impair the Website or interfere with any other party's use.",
                "Unauthorized use of this Website may give rise to a claim for damages and/or be a criminal offense."
            ]
        },
        {
            icon: Scale,
            title: "Intellectual Property Rights",
            content: [
                "All content on this Website, including text, graphics, logos, images, code, and software, is the property of Avishek Giri unless otherwise stated.",
                "The content is protected by copyright, trademark, and other intellectual property laws.",
                "You may not reproduce, distribute, modify, or create derivative works from any content without explicit written permission.",
                "Project screenshots and descriptions are for portfolio demonstration purposes only."
            ]
        },
        {
            icon: Ban,
            title: "Prohibited Activities",
            content: [
                "Attempting to gain unauthorized access to any part of the Website or related systems",
                "Using automated systems (bots, scrapers) to access the Website without permission",
                "Transmitting viruses, malware, or any harmful code",
                "Engaging in any activity that interferes with or disrupts the Website's functionality",
                "Using the Website for any illegal or unauthorized purpose"
            ]
        },
        {
            icon: DollarSign,
            title: "Services and Pricing",
            content: [
                "Information about services and pricing on this Website is for informational purposes only.",
                "Actual project costs and timelines will be discussed and agreed upon separately through direct communication.",
                "We reserve the right to modify service offerings and pricing at any time without prior notice.",
                "All project agreements will be formalized through separate contracts or agreements."
            ]
        },
        {
            icon: AlertCircle,
            title: "Disclaimer of Warranties",
            content: [
                "This Website and its content are provided 'as is' without any warranties, express or implied.",
                "We do not warrant that the Website will be uninterrupted, error-free, or free from viruses or other harmful components.",
                "We make no representations about the accuracy, reliability, or completeness of the content on this Website.",
                "Any reliance you place on information from this Website is strictly at your own risk."
            ]
        },
        {
            icon: Scale,
            title: "Limitation of Liability",
            content: [
                "To the fullest extent permitted by law, Avishek Giri shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this Website.",
                "This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.",
                "Our total liability for any claims arising from your use of the Website shall not exceed the amount you paid to access the Website (if any).",
                "Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above may not apply to you."
            ]
        }
    ];

    return (
        <>
            <Helmet>
                <title>Terms of Service | Avishek Giri - Full Stack Developer</title>
                <meta name="description" content="Terms of Service for coderavi.in - Read our terms and conditions for using this website." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://coderavi.in/terms-of-service" />
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
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl flex items-center justify-center">
                                    <Scale className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-display font-bold">
                                    Terms of <span className="text-gradient">Service</span>
                                </h1>
                            </div>
                            <p className="text-text-secondary text-lg">
                                Last Updated: February 8, 2026
                            </p>
                            <p className="text-text-secondary mt-4 text-base">
                                Please read these Terms of Service carefully before using coderavi.in.
                                These terms govern your access to and use of our Website.
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
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-accent-purple/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                <ul className="space-y-4 text-text-secondary">
                                    {section.content.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-accent-purple mt-1.5 flex-shrink-0">•</span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* Governing Law */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20 rounded-2xl p-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Governing Law
                            </h2>
                            <p className="text-text-secondary mb-4">
                                These Terms of Service shall be governed by and construed in accordance with the laws of India,
                                without regard to its conflict of law provisions.
                            </p>
                            <p className="text-text-secondary">
                                Any disputes arising from these terms or your use of the Website shall be subject to the
                                exclusive jurisdiction of the courts in Kolkata, West Bengal, India.
                            </p>
                        </motion.div>

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Contact Information
                            </h2>
                            <p className="text-text-secondary mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-2 text-text-secondary">
                                <p>
                                    <strong className="text-white">Email:</strong>{' '}
                                    <a href="mailto:contact@coderavi.in" className="text-accent-purple hover:text-accent-pink transition-colors">
                                        contact@coderavi.in
                                    </a>
                                </p>
                                <p>
                                    <strong className="text-white">Website:</strong>{' '}
                                    <a href="https://coderavi.in" className="text-accent-purple hover:text-accent-pink transition-colors">
                                        coderavi.in
                                    </a>
                                </p>
                            </div>
                        </motion.div>

                        {/* Changes Notice */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-3">
                                Changes to Terms
                            </h3>
                            <p className="text-text-secondary">
                                We reserve the right to modify or replace these Terms of Service at any time.
                                Material changes will be notified by posting the new terms on this page with an updated
                                "Last Updated" date. Your continued use of the Website after any changes constitutes
                                acceptance of the new terms.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="max-w-4xl mx-auto px-6 py-12 border-t border-white/10">
                    <div className="text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl text-white font-medium hover:shadow-lg hover:shadow-accent-purple/20 transition-all duration-300"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;
