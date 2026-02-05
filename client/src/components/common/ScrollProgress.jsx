import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (currentScroll / scrollHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress();

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue z-50 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
        />
    );
};

export default ScrollProgress;
