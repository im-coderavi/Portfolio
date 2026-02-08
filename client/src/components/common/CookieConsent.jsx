import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already accepted/declined cookies
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            // Show banner after 2 seconds
            const timer = setTimeout(() => {
                setShowBanner(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-gradient-to-r from-primary-dark/95 to-primary-darker/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-xl flex items-center justify-center">
                                        <Cookie className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                                        🍪 Cookie Notice
                                    </h3>
                                    <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                                        We use cookies to enhance your browsing experience, serve personalized ads or content,
                                        and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                                        Read our{' '}
                                        <Link
                                            to="/privacy-policy"
                                            className="text-accent-cyan hover:text-accent-blue underline transition-colors"
                                            onClick={() => setShowBanner(false)}
                                        >
                                            Privacy Policy
                                        </Link>{' '}
                                        to learn more.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    <button
                                        onClick={handleDecline}
                                        className="px-6 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all duration-300 text-sm font-medium"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-white hover:shadow-lg hover:shadow-accent-cyan/20 transition-all duration-300 text-sm font-medium"
                                    >
                                        Accept All
                                    </button>
                                </div>

                                {/* Close Button (Mobile) */}
                                <button
                                    onClick={handleDecline}
                                    className="absolute top-4 right-4 md:hidden text-text-secondary hover:text-white transition-colors"
                                    aria-label="Close cookie banner"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
