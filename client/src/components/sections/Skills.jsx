import React from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../../assets/data/skills';
import FadeIn from '../animations/FadeIn';

const Skills = () => {
    return (
        <section id="skills" className="py-20 bg-primary-dark dark:bg-primary-dark light:bg-gray-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                            Technical Skills
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full mb-4"></div>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Technologies and tools I use to bring ideas to life
                        </p>
                    </div>
                </FadeIn>

                {/* Skills by Category */}
                <div className="space-y-12">
                    {Object.entries(skillsData).map(([category, skills], categoryIndex) => (
                        <div key={category} className="max-w-6xl mx-auto">
                            <FadeIn direction="up" delay={0.1 * categoryIndex}>
                                <h3 className="text-xl font-display font-semibold text-white mb-6 text-center">
                                    <span className="inline-block px-6 py-2 bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 border border-accent-cyan/20 rounded-full">
                                        {category}
                                    </span>
                                </h3>
                            </FadeIn>

                            {/* Icons Only - Flex Layout */}
                            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
                                {skills.map((skill, index) => (
                                    <FadeIn key={skill.name} direction="up" delay={0.03 * index}>
                                        <motion.div
                                            whileHover={{
                                                y: -8,
                                                scale: 1.15,
                                            }}
                                            className="group relative"
                                            title={skill.name}
                                        >
                                            {/* Icon Container */}
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/5 dark:bg-white/5 light:bg-gray-100 rounded-xl border border-white/10 dark:border-white/10 light:border-gray-300 group-hover:bg-white/10 dark:group-hover:bg-white/10 light:group-hover:bg-gray-200 group-hover:border-accent-cyan/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-cyan/20">
                                                <img
                                                    src={skill.icon}
                                                    alt={skill.name}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Tooltip on Hover */}
                                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                                                <div className="bg-primary-light dark:bg-primary-light light:bg-white border border-accent-cyan/30 dark:border-accent-cyan/30 light:border-gray-300 px-3 py-1.5 rounded-lg shadow-lg">
                                                    <p className="text-white dark:text-white light:text-gray-900 text-xs font-semibold">{skill.name}</p>
                                                    <p className="text-accent-cyan text-xs">{skill.proficiency}%</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
