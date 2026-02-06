import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Link as LinkIcon, Trash2, Edit, LogOut, Bell, BellOff, Briefcase, FolderKanban } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FadeIn from '../components/animations/FadeIn';
import Button from '../components/common/Button';
import ProjectForm from '../components/admin/ProjectForm';
import ExperienceManager from '../components/admin/ExperienceManager';
import API_URL from '../config/api';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const navigate = useNavigate();

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

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/api/admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setNotificationsEnabled(response.data.settings.notificationsEnabled);
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        }
    };

    const toggleNotifications = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const newState = !notificationsEnabled;
            // Optimistic update
            setNotificationsEnabled(newState);

            await axios.post(`${API_URL}/api/admin/settings`, {
                notificationsEnabled: newState
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Failed to update settings', error);
            setNotificationsEnabled(!notificationsEnabled); // Revert on error
            alert('Failed to update notification settings');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchProjects();
        fetchSettings();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleCreate = async (projectData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(`${API_URL}/api/admin/projects`, projectData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
            setShowForm(false);
        } catch (error) {
            alert('Failed to create project: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdate = async (projectData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(
                `${API_URL}/api/admin/projects/${editingProject._id}`,
                projectData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchProjects();
            setEditingProject(null);
        } catch (error) {
            alert('Failed to update project: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/admin/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-dark flex items-center justify-center">
                <Loader2 className="animate-spin text-accent-cyan" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-dark p-6">
            <div className="max-w-7xl mx-auto">
                <header className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
                            <p className="text-text-secondary">Manage your portfolio content securely</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={toggleNotifications}
                                className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${notificationsEnabled
                                    ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/20'
                                    : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
                                    }`}
                                title={notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}
                            >
                                {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                            </button>
                            <Button
                                variant="secondary"
                                icon={LogOut}
                                onClick={handleLogout}
                                className="!bg-red-500/10 !text-red-400 !border-red-500/20 hover:!bg-red-500/20"
                            >
                                Logout
                            </Button>
                            {activeTab === 'projects' && (
                                <Button
                                    variant="primary"
                                    icon={Plus}
                                    onClick={() => {
                                        setEditingProject(null);
                                        setShowForm(true);
                                    }}
                                >
                                    Add Project
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'projects'
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/5 text-text-secondary hover:bg-white/10'
                                }`}
                        >
                            <FolderKanban size={20} />
                            Projects
                        </button>
                        <button
                            onClick={() => setActiveTab('experiences')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'experiences'
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/5 text-text-secondary hover:bg-white/10'
                                }`}
                        >
                            <Briefcase size={20} />
                            Experiences
                        </button>
                    </div>
                </header>

                {/* Tab Content */}
                {activeTab === 'projects' ? (
                    <>
                        {showForm || editingProject ? (
                            <FadeIn>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">
                                        {editingProject ? 'Edit Project' : 'New Project'}
                                    </h2>
                                    <ProjectForm
                                        initialData={editingProject}
                                        onSubmit={editingProject ? handleUpdate : handleCreate}
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditingProject(null);
                                        }}
                                    />
                                </div>
                            </FadeIn>
                        ) : null}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group"
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={project.image?.startsWith('http') ? project.image : `${project.image}`}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setEditingProject(project)}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-accent-cyan hover:text-black transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        {project.featured && (
                                            <span className="absolute top-2 right-2 bg-accent-cyan text-black text-xs font-bold px-2 py-1 rounded-md">
                                                FEATURED
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="text-xs px-2 py-1 rounded-md bg-white/5 text-accent-cyan border border-white/5">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && (
                                                <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-text-secondary">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex gap-3">
                                                {project.liveUrl && (
                                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent-cyan transition-colors">
                                                        <LinkIcon size={18} />
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-xs text-text-secondary">
                                                {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <ExperienceManager />
                )}
            </div>
        </div>
    );
};

export default Admin;
