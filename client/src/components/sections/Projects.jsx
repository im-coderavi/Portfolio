import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import FadeIn from '../animations/FadeIn';
import axios from 'axios';
import API_URL from '../../config/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/projects`);
                if (response.data.success) {
                    setProjects(response.data.projects);
                }
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-[#050505]">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-accent-purple" size={40} />
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="py-16 sm:py-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Featured <span className="text-gradient">Projects</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-purple to-accent-cyan mx-auto rounded-full mb-4" />
                        <p className="text-text-secondary text-lg">
                            Some of my recent work
                        </p>
                    </div>
                </FadeIn>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center text-text-secondary py-12">
                        <p>No projects added yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
                            {projects.slice(0, visibleCount).map((project, index) => (
                                <FadeIn key={project.id || index} direction="up" delay={0.1 * index}>
                                    <div className="glass rounded-2xl overflow-hidden group h-full flex flex-col">
                                        {/* Project Image */}
                                        <div className="relative aspect-video md:h-64 md:aspect-auto overflow-hidden bg-[#0a0a0a]">
                                            <img
                                                src={project.image?.startsWith('http') ? project.image : `${API_URL}${project.image}`}
                                                alt={project.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="w-full h-full hidden items-center justify-center text-4xl font-bold text-gradient">
                                                {project.title.substring(0, 2)}
                                            </div>

                                            {/* Overlay on Hover */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                className="absolute inset-0 bg-black/90 flex items-center justify-center gap-4"
                                            >
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-3 bg-gradient-to-r from-accent-purple to-accent-cyan text-white rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                                                    >
                                                        <ExternalLink size={18} />
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-2"
                                                    >
                                                        <Github size={18} />
                                                        Code
                                                    </a>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Project Content */}
                                        <div className="p-4 md:p-6 space-y-4 flex flex-col flex-grow">
                                            {/* Featured Badge */}
                                            {project.featured && (
                                                <span className="inline-block self-start px-3 py-1 bg-gradient-to-r from-accent-purple to-accent-violet text-white text-xs font-semibold rounded-full">
                                                    Featured
                                                </span>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-xl md:text-2xl font-bold text-white">
                                                {project.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-text-secondary leading-relaxed flex-grow">
                                                {project.description}
                                            </p>

                                            {/* Technologies */}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {project.technologies.slice(0, 4).map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-accent-purple/10 border border-accent-purple/20 text-accent-violet text-xs rounded-lg"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 4 && (
                                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-text-secondary text-xs rounded-lg">
                                                        +{project.technologies.length - 4}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Mobile Links */}
                                            <div className="flex gap-3 pt-4 md:hidden">
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-accent-purple/10 border border-accent-purple/20 text-accent-violet text-sm font-semibold rounded-lg hover:bg-accent-purple/20 transition-colors"
                                                    >
                                                        <ExternalLink size={16} />
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors"
                                                    >
                                                        <Github size={16} />
                                                        Code
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < projects.length && (
                            <FadeIn direction="up">
                                <div className="text-center">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 4)}
                                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-accent-purple/10 hover:border-accent-purple/50 hover:text-accent-violet transition-all"
                                    >
                                        Load More Projects
                                    </button>
                                </div>
                            </FadeIn>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Projects;
