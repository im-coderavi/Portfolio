import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Folder, Code, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import FadeIn from '../animations/FadeIn';

const Counter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    useEffect(() => {
        if (!inView) return;

        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [inView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const About = () => {
    const stats = [
        { icon: Calendar, value: 2, suffix: '+', label: 'Years Experience', color: 'from-accent-cyan to-accent-blue' },
        { icon: Folder, value: 20, suffix: '+', label: 'Projects Completed', color: 'from-accent-blue to-accent-purple' },
        { icon: Code, value: 15, suffix: '+', label: 'Technologies', color: 'from-accent-purple to-accent-pink' },
        { icon: Star, value: 100, suffix: '%', label: 'Client Satisfaction', color: 'from-accent-orange to-accent-pink' },
    ];

    const highlights = [
        'Specialized in MERN Stack development with AI integration',
        '20+ Google AdSense approvals achieved for clients',
        '2+ React Native applications delivered',
        'Expert in building SEO-optimized, scalable SaaS platforms',
        'Strong foundation in DSA, OOP, and system design',
    ];

    return (
        <section id="about" className="py-20 px-6 bg-primary-darker relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            About <span className="text-gradient">Me</span>
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Passionate developer crafting digital experiences
                        </p>
                    </div>
                </FadeIn>

                {/* Main Content Card */}
                <FadeIn direction="up" delay={0.2}>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 mb-12 hover:border-accent-cyan/30 transition-all duration-300">
                        <div className="space-y-6 text-text-secondary text-base sm:text-lg leading-relaxed">
                            <p className="text-white/90">
                                Final-year <span className="text-accent-cyan font-semibold">B.Tech (CSE) student</span> and
                                freelance full-stack developer focused on delivering high-quality MERN-based web applications.
                            </p>

                            <p>
                                Strong in building <span className="text-accent-cyan font-semibold">responsive UIs</span>,
                                robust APIs, and integrating <span className="text-accent-cyan font-semibold">AI-driven features</span> to
                                solve practical business needs.
                            </p>

                            <p>
                                Known for clean code, problem-solving, and continuous learning through real projects.
                                Over <span className="text-accent-cyan font-semibold">2+ years of freelance experience</span> delivering
                                20+ successful projects with <span className="text-accent-cyan font-semibold">100% client satisfaction</span>.
                            </p>

                            {/* Highlights */}
                            <div className="pt-4 grid sm:grid-cols-2 gap-3">
                                {highlights.map((highlight, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex items-start gap-3 group"
                                    >
                                        <span className="text-accent-cyan text-lg mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">✓</span>
                                        <p className="text-sm sm:text-base">{highlight}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, index) => (
                        <FadeIn key={index} direction="up" delay={0.1 * index}>
                            <motion.div
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-cyan/10 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 group-hover:scale-110 transition-transform`}>
                                    <div className="w-full h-full bg-primary-dark rounded-xl flex items-center justify-center">
                                        <stat.icon size={24} className="text-white sm:w-7 sm:h-7" />
                                    </div>
                                </div>
                                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    <Counter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-text-secondary text-xs sm:text-sm md:text-base">{stat.label}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
