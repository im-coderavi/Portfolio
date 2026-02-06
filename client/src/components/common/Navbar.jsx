import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import { Link } from 'react-scroll';
import useScrollPosition from '../../hooks/useScrollPosition';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const scrollPosition = useScrollPosition();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (scrollPosition > lastScrollY && scrollPosition > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setLastScrollY(scrollPosition);
    }, [scrollPosition]);

    const navLinks = [
        { name: 'Home', to: 'hero' },
        { name: 'About', to: 'about' },
        { name: 'Skills', to: 'skills' },
        { name: 'Projects', to: 'projects' },
        { name: 'Education', to: 'education' },
        { name: 'Contact', to: 'contact' },
    ];

    const handleDownloadCV = () => {
        const link = document.createElement('a');
        link.href = '/Avishek_Giri_CV.pdf';
        link.download = 'Avishek_Giri_CV.pdf';
        link.click();
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: isVisible ? 0 : -100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass border-b border-white/10 dark:border-white/10 light:border-black/10"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="hero"
                    smooth={true}
                    duration={500}
                    className="text-2xl font-display font-bold logo-rgb-text cursor-pointer"
                >
                    Avishek Giri
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            offset={-80}
                            spy={true}
                            activeClass="text-accent-cyan"
                            className="text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer font-medium dark:text-text-secondary light:text-gray-700"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Theme Toggle Button */}
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent-cyan/50 transition-all dark:bg-white/5 light:bg-black/5 dark:border-white/10 light:border-black/10"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="text-accent-cyan" />
                        ) : (
                            <Moon size={20} className="text-accent-blue" />
                        )}
                    </motion.button>

                    <button
                        onClick={handleDownloadCV}
                        className="px-6 py-2.5 bg-gradient-to-r from-accent-orange to-accent-pink text-white rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Download size={18} />
                        Download CV
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    {/* Mobile Theme Toggle */}
                    <motion.button
                        onClick={toggleTheme}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-white/5 border border-white/10"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="text-accent-cyan" />
                        ) : (
                            <Moon size={20} className="text-accent-blue" />
                        )}
                    </motion.button>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white p-2 dark:text-white light:text-gray-900"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 pb-4"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    smooth={true}
                                    duration={500}
                                    offset={-80}
                                    onClick={() => setIsOpen(false)}
                                    className="text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer font-medium py-2"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    handleDownloadCV();
                                    setIsOpen(false);
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-accent-orange to-accent-pink text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Download CV
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
