import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import FadeIn from '../animations/FadeIn';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projects');
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
            <section id="projects" className="py-20 bg-primary-darker dark:bg-primary-darker light:bg-gray-100 transition-colors duration-300">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-accent-cyan" size={40} />
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="py-20 bg-primary-darker dark:bg-primary-darker light:bg-gray-100 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                            Featured Projects
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full mb-4"></div>
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
                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {projects.slice(0, visibleCount).map((project, index) => (
                                <FadeIn key={project.id || index} direction="up" delay={0.1 * index}>
                                    <Card className="overflow-hidden p-0 group h-full flex flex-col">
                                        {/* Project Image */}
                                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-light to-primary-dark">
                                            <img
                                                src={project.image?.startsWith('http') ? project.image : `http://localhost:5000${project.image}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                            {/* Placeholder if image fails */}
                                            <div className="w-full h-full hidden items-center justify-center text-4xl font-bold text-gradient">
                                                {project.title.substring(0, 2)}
                                            </div>

                                            {/* Overlay on Hover */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                className="absolute inset-0 bg-primary-dark/90 flex items-center justify-center gap-4"
                                            >
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
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
                                                        className="px-6 py-3 border-2 border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-2"
                                                    >
                                                        <Github size={18} />
                                                        Code
                                                    </a>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Project Content */}
                                        <div className="p-6 space-y-4 flex flex-col flex-grow">
                                            {/* Featured Badge */}
                                            {project.featured && (
                                                <span className="inline-block self-start px-3 py-1 bg-gradient-to-r from-accent-cyan to-accent-blue text-white text-xs font-semibold rounded-full">
                                                    Featured
                                                </span>
                                            )}

                                            {/* Title */}
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1">
                                                    {project.title}
                                                </h3>
                                            </div>

                                            {/* Description */}
                                            <p className="text-text-secondary leading-relaxed flex-grow">
                                                {project.description}
                                            </p>

                                            {/* Technologies */}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {project.technologies.slice(0, 4).map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs rounded-lg"
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

                                            {/* Links (Mobile Friendly / Visible always) */}
                                            <div className="flex gap-4 pt-4 md:hidden">
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-accent-cyan font-semibold"
                                                    >
                                                        Live Demo →
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-accent-cyan font-semibold"
                                                    >
                                                        GitHub →
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </FadeIn>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < projects.length && (
                            <FadeIn direction="up">
                                <div className="text-center">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 4)}
                                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-accent-cyan/50 hover:text-accent-cyan transition-all"
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
