import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Download, ArrowRight, Github, Linkedin, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-scroll';
import Button from '../common/Button';
import FadeIn from '../animations/FadeIn';

const Hero = () => {
    const handleDownloadCV = () => {
        window.open('https://drive.google.com/file/d/1n6ldWkBO1U5yGBveH30EqiRajkorXa2w/view?usp=drive_link', '_blank');
    };

    const socialLinks = [
        { icon: Linkedin, url: 'https://www.linkedin.com/in/im-coderavi/', label: 'LinkedIn' },
        { icon: Github, url: 'https://github.com/im-coderavi', label: 'GitHub' },
        { icon: Globe, url: 'https://www.coderavi.in/', label: 'Portfolio' },
    ];

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-black">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-cyan/8 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-violet/5 rounded-full blur-[80px]" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12">
                <div className="grid md:grid-cols-[60%_40%] gap-10 items-center">

                    {/* LEFT — Text Content */}
                    <div className="space-y-5 text-left order-2 md:order-1">
                        <FadeIn direction="up" delay={0.2}>
                            <p className="text-accent-cyan text-sm sm:text-base font-medium tracking-widest uppercase">
                                Hi, I'm
                            </p>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.3}>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold uppercase tracking-wider text-gradient leading-tight">
                                AVISHEK GIRI
                            </h1>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.4}>
                            <div className="h-10 sm:h-14 flex items-center">
                                <TypeAnimation
                                    sequence={[
                                        'Full Stack Developer', 2000,
                                        'MERN Stack Expert', 2000,
                                        'AI Integration Specialist', 2000,
                                        'Freelance Developer', 2000,
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                                />
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.5}>
                            <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                                Crafting scalable web applications with modern technologies and AI-driven innovation.
                                Specialized in building production-ready solutions that drive business growth.
                            </p>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.6}>
                            <div className="flex flex-wrap gap-3 pt-2">
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
                                    <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                                        Contact Me
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.7}>
                            <div className="flex gap-4 pt-2">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, y: -4 }}
                                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-purple/50 hover:bg-accent-purple/10 transition-all"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </FadeIn>
                    </div>

                    {/* RIGHT — Profile Image */}
                    <FadeIn direction="up" delay={0.3} className="order-1 md:order-2">
                        <div className="relative flex justify-center items-center">
                            <motion.div
                                animate={{ y: [0, -16, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative"
                            >
                                {/* Glow behind image */}
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-violet rounded-3xl blur-xl opacity-40" />

                                {/* Image */}
                                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] rounded-3xl overflow-hidden border border-white/10 bg-[#0f0f0f]">
                                    <img
                                        src="/assets/images/profile.jpg"
                                        alt="Avishek Giri - Full Stack Developer"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            const fallback = e.target.nextElementSibling;
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    <div className="w-full h-full hidden items-center justify-center text-6xl font-bold text-gradient absolute inset-0">
                                        AG
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-8 -right-8 w-20 h-20 border border-accent-purple/30 rounded-full hidden sm:block"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-8 -left-8 w-14 h-14 border border-accent-cyan/30 rounded-full hidden sm:block"
                            />
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Scroll Indicator */}
            <Link to="about" smooth={true} duration={500} offset={-80}>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
                >
                    <ChevronDown size={30} className="text-accent-purple" />
                </motion.div>
            </Link>
        </section>
    );
};

export default Hero;
