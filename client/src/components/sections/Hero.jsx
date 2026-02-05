import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Download, ArrowRight, Github, Linkedin, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-scroll';
import Button from '../common/Button';
import FadeIn from '../animations/FadeIn';

const Hero = () => {
    const handleDownloadCV = () => {
        const link = document.createElement('a');
        link.href = '/Avishek_Giri_CV.pdf';
        link.download = 'Avishek_Giri_CV.pdf';
        link.click();
    };

    const socialLinks = [
        { icon: Linkedin, url: 'https://linkedin.com/in/avishekgiri', label: 'LinkedIn' },
        { icon: Github, url: 'https://github.com/avishekgiri', label: 'GitHub' },
        { icon: Globe, url: 'https://avishekgiri.dev', label: 'Portfolio' },
    ];

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-primary-dark dark:bg-primary-dark light:bg-gray-50 transition-colors duration-300">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-[60%_40%] gap-12 items-center">
                {/* Profile Image - Shows FIRST on mobile, SECOND on desktop */}
                <FadeIn direction="up" delay={0.3} className="order-1 md:order-2">
                    <div className="relative flex justify-center items-center">
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            {/* Gradient Border Frame */}
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple rounded-3xl blur-xl opacity-50"></div>

                            {/* Image Container */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border-4 border-white/10 dark:border-white/10 light:border-black/10 bg-gradient-to-br from-primary-light to-primary-dark dark:from-primary-light dark:to-primary-dark light:from-gray-100 light:to-gray-200">
                                {/* Profile Image */}
                                <img
                                    src="/assets/images/profile.jpg"
                                    alt="Avishek Giri - Full Stack Developer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Show initials if image not found
                                        e.target.style.display = 'none';
                                        const fallback = e.target.nextElementSibling;
                                        if (fallback) {
                                            fallback.style.display = 'flex';
                                        }
                                    }}
                                />
                                {/* Fallback - Only shows when image fails to load */}
                                <div className="w-full h-full hidden items-center justify-center text-6xl font-bold text-gradient absolute inset-0">
                                    AG
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Decorative Elements */}
                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -top-10 -right-10 w-20 h-20 border-2 border-accent-cyan/30 rounded-full"
                        ></motion.div>

                        <motion.div
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -bottom-10 -left-10 w-16 h-16 border-2 border-accent-pink/30 rounded-full"
                        ></motion.div>
                    </div>
                </FadeIn>

                {/* Text Content - Shows SECOND on mobile, FIRST on desktop */}
                <div className="space-y-6 order-2 md:order-1">
                    <FadeIn direction="up" delay={0.2}>
                        <p className="text-accent-cyan text-lg md:text-xl font-medium">
                            Hi, I'm
                        </p>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.3}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gradient leading-tight">
                            AVISHEK GIRI
                        </h1>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.4}>
                        <div className="h-16 md:h-20">
                            <TypeAnimation
                                sequence={[
                                    'Full Stack Developer',
                                    2000,
                                    'MERN Stack Expert',
                                    2000,
                                    'AI Integration Specialist',
                                    2000,
                                    'Freelance Developer',
                                    2000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                                className="text-2xl md:text-4xl font-bold text-white dark:text-white light:text-gray-900"
                            />
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.5}>
                        <p className="text-text-secondary dark:text-text-secondary light:text-gray-600 text-base md:text-lg max-w-xl leading-relaxed">
                            Crafting scalable web applications with modern technologies and AI-driven innovation.
                            Specialized in building production-ready solutions that drive business growth.
                        </p>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.6}>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                variant="primary"
                                size="lg"
                                icon={Download}
                                iconPosition="right"
                                onClick={handleDownloadCV}
                            >
                                Download CV
                            </Button>

                            <Link to="contact" smooth={true} duration={500} offset={-80}>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    Contact Me
                                </Button>
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.7}>
                        <div className="flex gap-5 pt-6">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2, y: -5 }}
                                    className="w-12 h-12 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/50 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Scroll Indicator */}
            <Link to="about" smooth={true} duration={500} offset={-80}>
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
                >
                    <ChevronDown size={32} className="text-accent-cyan" />
                </motion.div>
            </Link>
        </section>
    );
};

export default Hero;
