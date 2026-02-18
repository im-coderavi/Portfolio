import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import FadeIn from '../animations/FadeIn';
import API_URL from '../../config/api';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/experiences`);
                if (response.data.success) {
                    setExperiences(response.data.experiences);
                }
            } catch (error) {
                console.error('Failed to fetch experiences', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading || experiences.length === 0) return null;

    return (
        <section id="experience" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#050505] relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/8 rounded-full blur-[100px]" />

            <div className="max-w-5xl mx-auto relative z-10">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Professional <span className="text-gradient">Experience</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-purple to-accent-cyan mx-auto rounded-full mb-4" />
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            My journey through various roles and companies
                        </p>
                    </div>
                </FadeIn>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-purple via-accent-cyan to-accent-purple opacity-30" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp._id}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative pl-14 md:pl-20"
                            >
                                {/* Timeline node */}
                                <div className="absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan shadow-lg shadow-accent-purple/50 z-10" />

                                {/* Content card */}
                                <div className="glass rounded-2xl p-6 md:p-8 group">
                                    <div className="flex flex-col gap-3 mb-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors break-words">
                                                    {exp.position}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-text-secondary">
                                                    <span className="flex items-center gap-2">
                                                        <Briefcase size={16} className="text-accent-purple flex-shrink-0" />
                                                        <span className="font-medium break-words">{exp.company}</span>
                                                    </span>
                                                    {exp.location && (
                                                        <>
                                                            <span className="text-white/20 hidden sm:inline">•</span>
                                                            <span className="flex items-center gap-2">
                                                                <MapPin size={16} className="text-accent-cyan flex-shrink-0" />
                                                                <span className="break-words">{exp.location}</span>
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Date badge */}
                                            <div className="flex items-center">
                                                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20">
                                                    <Calendar size={14} className="text-accent-purple flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                                                        {formatDate(exp.startDate)} - {exp.current ? (
                                                            <span className="text-accent-cyan font-bold">Present</span>
                                                        ) : formatDate(exp.endDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current badge */}
                                    {exp.current && (
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 bg-accent-purple/15 text-accent-violet rounded-full text-xs font-bold uppercase tracking-wider border border-accent-purple/30">
                                                Current Position
                                            </span>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {exp.description && (
                                        <div className="text-text-secondary leading-relaxed mb-4 text-left text-sm sm:text-base">
                                            {exp.description.split('\n').map((line, idx) => {
                                                const trimmedLine = line.trim();
                                                if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                                                    return (
                                                        <div key={idx} className="flex gap-2 sm:gap-3 mb-2">
                                                            <span className="text-accent-purple mt-1 flex-shrink-0 text-sm">•</span>
                                                            <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
                                                        </div>
                                                    );
                                                }
                                                return trimmedLine ? <p key={idx} className="mb-2">{trimmedLine}</p> : null;
                                            })}
                                        </div>
                                    )}

                                    {/* Technologies */}
                                    {exp.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 text-xs font-medium rounded-full bg-accent-purple/10 text-accent-violet border border-accent-purple/20 hover:border-accent-purple/50 transition-colors"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
