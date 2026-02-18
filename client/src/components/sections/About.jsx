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
        { icon: Calendar, value: 2, suffix: '+', label: 'Years Experience', color: 'from-accent-purple to-accent-cyan' },
        { icon: Folder, value: 20, suffix: '+', label: 'Projects Completed', color: 'from-accent-cyan to-accent-blue' },
        { icon: Code, value: 15, suffix: '+', label: 'Technologies', color: 'from-accent-blue to-accent-violet' },
        { icon: Star, value: 100, suffix: '%', label: 'Client Satisfaction', color: 'from-accent-violet to-accent-purple' },
    ];

    const highlights = [
        'Specialized in MERN Stack development with AI integration',
        '20+ Google AdSense approvals achieved for clients',
        '2+ React Native applications delivered',
        'Expert in building SEO-optimized, scalable SaaS platforms',
        'Strong foundation in DSA, OOP, and system design',
    ];

    return (
        <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#050505] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-purple/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px]" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            About <span className="text-gradient">Me</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-purple to-accent-cyan mx-auto rounded-full mb-4" />
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Passionate developer crafting digital experiences
                        </p>
                    </div>
                </FadeIn>

                {/* Main Content Card */}
                <FadeIn direction="up" delay={0.2}>
                    <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 mb-12">
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
                                        <span className="text-accent-purple text-lg mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">✓</span>
                                        <p className="text-sm sm:text-base">{highlight}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>


            </div>
        </section>
    );
};

export default About;
