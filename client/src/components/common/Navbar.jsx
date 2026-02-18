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
    const [scrolled, setScrolled] = useState(false);
    const scrollPosition = useScrollPosition();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (scrollPosition > lastScrollY && scrollPosition > 100) {
            setIsVisible(false);
            setIsOpen(false);
        } else {
            setIsVisible(true);
        }
        setScrolled(scrollPosition > 20);
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
        window.open('https://drive.google.com/file/d/1n6ldWkBO1U5yGBveH30EqiRajkorXa2w/view?usp=drive_link', '_blank');
    };

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: isVisible ? 0 : -120, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
        >
            {/* Floating Pill Navbar */}
            <motion.nav
                animate={{
                    boxShadow: scrolled
                        ? '0 8px 32px rgba(124, 58, 237, 0.15), 0 0 0 1px rgba(255,255,255,0.06)'
                        : '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-5xl rounded-2xl px-4 sm:px-6 py-3"
                style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="hero"
                        smooth={true}
                        duration={500}
                        className="text-xl font-display font-bold logo-rgb-text cursor-pointer flex-shrink-0"
                    >
                        Avishek Giri
                    </Link>

                    {/* Desktop Navigation — centered */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                smooth={true}
                                duration={500}
                                offset={-80}
                                spy={true}
                                activeClass="active-nav-link"
                                className="nav-link relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors cursor-pointer rounded-xl hover:bg-white/5 group"
                            >
                                {link.name}
                                {/* Active underline indicator */}
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full group-[.active-nav-link]:w-4 transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.07] hover:bg-accent-purple/15 hover:border-accent-purple/40 transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun size={17} className="text-accent-cyan" />
                            ) : (
                                <Moon size={17} className="text-accent-violet" />
                            )}
                        </motion.button>

                        {/* Download CV — pill button */}
                        <motion.button
                            onClick={handleDownloadCV}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #7C3AED, #00D4FF)',
                                boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                            }}
                        >
                            <Download size={15} />
                            Download CV
                        </motion.button>
                    </div>

                    {/* Mobile: Theme + Hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.92 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.07]"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun size={17} className="text-accent-cyan" />
                            ) : (
                                <Moon size={17} className="text-accent-violet" />
                            )}
                        </motion.button>

                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            whileTap={{ scale: 0.92 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.07] text-white"
                        >
                            {isOpen ? <X size={18} /> : <Menu size={18} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="pt-3 pb-1 border-t border-white/[0.06] mt-3 flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        smooth={true}
                                        duration={500}
                                        offset={-80}
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <motion.button
                                    onClick={() => { handleDownloadCV(); setIsOpen(false); }}
                                    className="mt-2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #7C3AED, #00D4FF)',
                                    }}
                                >
                                    <Download size={15} />
                                    Download CV
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </motion.div>
    );
};

export default Navbar;
