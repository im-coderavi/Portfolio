import React from 'react';
import { skillsData } from '../../assets/data/skills';
import FadeIn from '../animations/FadeIn';
import SkillSphere from './SkillSphere';

// Flatten all skills into a single array for the sphere
const allSkills = Object.values(skillsData).flat();

const Skills = () => {
    return (
        <section id="skills" className="py-16 sm:py-20 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Technical <span className="text-gradient">Skills</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-purple to-accent-cyan mx-auto rounded-full mb-4" />
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Drag to rotate · Hover to explore
                        </p>
                    </div>
                </FadeIn>

                {/* 3D Sphere */}
                <FadeIn direction="up" delay={0.2}>
                    <SkillSphere skills={allSkills} />
                </FadeIn>

                {/* Category Legend */}
                <FadeIn direction="up" delay={0.4}>
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {Object.keys(skillsData).map((category) => (
                            <span
                                key={category}
                                className="px-4 py-1.5 text-xs font-medium rounded-full border border-accent-purple/20 bg-accent-purple/5 text-text-secondary"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default Skills;
