import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { educationData, certificationsData } from '../../assets/data/education';
import Card from '../common/Card';
import FadeIn from '../animations/FadeIn';

const Education = () => {
    return (
        <section id="education" className="py-20 bg-primary-dark dark:bg-primary-dark light:bg-gray-50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                            Education & Certifications
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full"></div>
                    </div>
                </FadeIn>

                {/* Education Timeline */}
                <div className="mb-16">
                    <FadeIn direction="up" delay={0.2}>
                        <h3 className="text-2xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                            <GraduationCap className="text-accent-cyan" size={28} />
                            Education
                        </h3>
                    </FadeIn>

                    <div className="space-y-8 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-cyan to-accent-purple hidden md:block"></div>

                        {educationData.map((edu, index) => (
                            <FadeIn key={edu.id} direction="up" delay={0.1 * index}>
                                <div className="relative md:pl-12">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 top-8 w-4 h-4 bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full border-4 border-primary-dark hidden md:block -translate-x-[7px]"></div>

                                    <Card className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-2">
                                                    {edu.degree}
                                                </h4>
                                                <p className="text-accent-cyan font-semibold mb-1">
                                                    {edu.institution}
                                                </p>
                                                <p className="text-text-secondary text-sm">
                                                    {edu.location}
                                                </p>
                                            </div>
                                            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
                                                <span className="text-text-secondary text-sm">
                                                    {edu.year}
                                                </span>
                                                <span className="px-4 py-1 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan rounded-full text-sm font-semibold">
                                                    GPA: {edu.gpa}
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="space-y-2">
                                            {edu.highlights.map((highlight, i) => (
                                                <li key={i} className="flex items-start gap-2 text-text-secondary">
                                                    <span className="text-accent-green mt-1">•</span>
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div>
                    <FadeIn direction="up">
                        <h3 className="text-2xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                            <Award className="text-accent-cyan" size={28} />
                            Certifications
                        </h3>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6">
                        {certificationsData.map((cert, index) => (
                            <FadeIn key={cert.id} direction="up" delay={0.1 * index}>
                                <Card className="text-center p-6 hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 mx-auto mb-4">
                                        <img
                                            src={cert.icon}
                                            alt={cert.issuer}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-2">
                                        {cert.title}
                                    </h4>
                                    <p className="text-accent-cyan text-sm mb-1">
                                        {cert.issuer}
                                    </p>
                                    <p className="text-text-secondary text-sm">
                                        {cert.date}
                                    </p>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
