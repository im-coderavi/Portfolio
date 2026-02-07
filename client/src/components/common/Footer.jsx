import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { Github, Linkedin, Globe, Mail, Heart, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Linkedin, url: 'https://www.linkedin.com/in/im-coderavi/', label: 'LinkedIn' },
        { icon: Github, url: 'https://github.com/im-coderavi', label: 'GitHub' },
        { icon: Globe, url: 'https://www.coderavi.in/', label: 'Portfolio' },
        { icon: Mail, url: 'mailto:avishekgiri31@gmail.com', label: 'Email' },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-primary-darker relative overflow-hidden border-t border-white/10">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/30 to-primary-darker" />
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent-cyan/3 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent-purple/3 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 relative z-10">

                {/* Main Content */}
                <div className="flex flex-col items-center text-center space-y-8">

                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3 className="text-3xl sm:text-4xl font-display font-bold text-gradient mb-3">
                            Avishek Giri
                        </h3>
                        <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
                            Full Stack MERN Developer building modern web applications
                        </p>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex gap-4"
                    >
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-gradient-to-br hover:from-accent-cyan/20 hover:to-accent-purple/20 hover:border-accent-cyan/50 transition-all duration-300"
                                aria-label={social.label}
                            >
                                <social.icon size={20} className="sm:w-6 sm:h-6" />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Divider */}
                    <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Bottom Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-between w-full gap-4"
                    >
                        <p className="text-text-secondary text-xs sm:text-sm flex items-center gap-2 flex-wrap justify-center">
                            <span>
                                © {currentYear}{' '}
                                <span
                                    onClick={() => navigate('/admin')}
                                    className="cursor-default hover:text-accent-cyan transition-colors"
                                >
                                    Avishek Giri
                                </span>
                            </span>
                            <span className="hidden sm:inline text-white/20">•</span>
                            <span className="flex items-center gap-1">
                                Made with <Heart size={14} className="text-accent-pink fill-accent-pink animate-pulse" /> in India
                            </span>
                        </p>

                        {/* Scroll to Top */}
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/20 transition-all group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
