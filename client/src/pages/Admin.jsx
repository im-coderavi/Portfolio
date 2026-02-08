import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Link as LinkIcon, Trash2, Edit, LogOut, Bell, BellOff, Briefcase, FolderKanban, Settings as SettingsIcon, Save as SaveIcon, Handshake, Menu, X, Home, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FadeIn from '../components/animations/FadeIn';
import Button from '../components/common/Button';
import ProjectForm from '../components/admin/ProjectForm';
import ExperienceManager from '../components/admin/ExperienceManager';
import DealsManager from '../components/admin/DealsManager';
import API_URL from '../config/api';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [adsenseCode, setAdsenseCode] = useState('');
    const [adsTxt, setAdsTxt] = useState('');
    const [metaTags, setMetaTags] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const menuItems = [
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'experiences', label: 'Experiences', icon: Briefcase },
        { id: 'deals', label: 'Deals', icon: Handshake },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

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
            const password = localStorage.getItem('adminPassword');
            const response = await axios.get(`${API_URL}/api/admin/settings`, {
                headers: { 'X-Admin-Password': password }
            });
            if (response.data.success) {
                setNotificationsEnabled(response.data.settings.notificationsEnabled);
                setAdsenseCode(response.data.settings.adsenseCode || '');
                setAdsTxt(response.data.settings.adsTxt || '');
                setMetaTags(response.data.settings.metaTags || '');
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        }
    };

    const toggleNotifications = async () => {
        try {
            const password = localStorage.getItem('adminPassword');
            const newState = !notificationsEnabled;
            setNotificationsEnabled(newState);

            await axios.post(`${API_URL}/api/admin/settings`, {
                notificationsEnabled: newState
            }, {
                headers: { 'X-Admin-Password': password }
            });
        } catch (error) {
            console.error('Failed to update settings', error);
            setNotificationsEnabled(!notificationsEnabled);
            alert('Failed to update notification settings');
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            const password = localStorage.getItem('adminPassword');
            await axios.post(`${API_URL}/api/admin/settings`, {
                notificationsEnabled,
                adsenseCode,
                adsTxt,
                metaTags
            }, {
                headers: { 'X-Admin-Password': password }
            });
            alert('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings');
        }
    };

    useEffect(() => {
        const password = localStorage.getItem('adminPassword');
        if (!password) {
            navigate('/admin/login');
            return;
        }
        fetchProjects();
        fetchSettings();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminPassword');
        navigate('/admin/login');
    };

    const handleCreate = async (projectData) => {
        try {
            const password = localStorage.getItem('adminPassword');
            await axios.post(`${API_URL}/api/admin/projects`, projectData, {
                headers: { 'X-Admin-Password': password }
            });
            fetchProjects();
            setShowForm(false);
        } catch (error) {
            alert('Failed to create project: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdate = async (projectData) => {
        try {
            const password = localStorage.getItem('adminPassword');
            await axios.put(
                `${API_URL}/api/admin/projects/${editingProject._id}`,
                projectData,
                { headers: { 'X-Admin-Password': password } }
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
            const password = localStorage.getItem('adminPassword');
            await axios.delete(`${API_URL}/api/admin/projects/${id}`, {
                headers: { 'X-Admin-Password': password }
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
        <div className="min-h-screen bg-primary-dark flex">
            {/* Left Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-primary-darker border-r border-white/10 flex flex-col transition-all duration-300 fixed h-full z-50`}>
                {/* Logo/Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-xl flex items-center justify-center">
                                    <User className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white text-sm">Admin Panel</h2>
                                    <p className="text-xs text-text-secondary">Portfolio Manager</p>
                                </div>
                            </motion.div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-secondary hover:text-white"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                        ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-black font-semibold shadow-lg shadow-accent-cyan/20'
                                        : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                {sidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    <button
                        onClick={toggleNotifications}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${notificationsEnabled
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-white/5 text-text-secondary hover:bg-white/10'
                            }`}
                    >
                        {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                        {sidebarOpen && (
                            <span className="text-sm">
                                {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-primary-dark/80 backdrop-blur-xl border-b border-white/10 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white capitalize">
                                {activeTab === 'settings' ? 'AdSense & SEO Settings' : activeTab}
                            </h1>
                            <p className="text-text-secondary text-sm">
                                {activeTab === 'projects' && `Manage your ${projects.length} projects`}
                                {activeTab === 'experiences' && 'Manage your work experiences'}
                                {activeTab === 'deals' && 'Track project inquiries & deals'}
                                {activeTab === 'settings' && 'Configure AdSense and SEO settings'}
                            </p>
                        </div>
                        <div className="flex gap-3">
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
                </header>

                {/* Content Area */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
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

                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {projects.map((project) => (
                                        <motion.div
                                            key={project._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-accent-cyan/50 transition-all"
                                        >
                                            <div className="aspect-video relative overflow-hidden">
                                                <img
                                                    src={project.image?.startsWith('http') ? project.image : `${API_URL}${project.image}`}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setEditingProject(project)}
                                                        className="p-3 bg-white/10 rounded-xl hover:bg-accent-cyan hover:text-black transition-colors backdrop-blur-sm"
                                                        title="Edit"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project._id)}
                                                        className="p-3 bg-white/10 rounded-xl hover:bg-red-500 transition-colors backdrop-blur-sm"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                {project.featured && (
                                                    <span className="absolute top-3 right-3 bg-gradient-to-r from-accent-cyan to-accent-blue text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                        FEATURED
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.technologies.slice(0, 3).map((tech, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 rounded-lg bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.technologies.length > 3 && (
                                                        <span className="text-xs px-2 py-1 rounded-lg bg-white/5 text-text-secondary">
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
                            </motion.div>
                        )}

                        {/* Experiences Tab */}
                        {activeTab === 'experiences' && (
                            <motion.div
                                key="experiences"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ExperienceManager />
                            </motion.div>
                        )}

                        {/* Deals Tab */}
                        {activeTab === 'deals' && (
                            <motion.div
                                key="deals"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DealsManager />
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="max-w-3xl">
                                    <form onSubmit={handleSaveSettings} className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <label className="block text-white font-semibold mb-2">Google AdSense Code</label>
                                            <p className="text-xs text-text-secondary mb-3">Paste the script tag provided by Google AdSense here.</p>
                                            <textarea
                                                value={adsenseCode}
                                                onChange={(e) => setAdsenseCode(e.target.value)}
                                                className="w-full bg-primary-dark border border-white/10 rounded-xl p-4 text-white focus:border-accent-cyan focus:outline-none h-32 font-mono text-sm resize-none"
                                                placeholder="<script async src=&quot;...&quot;></script>"
                                            />
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <label className="block text-white font-semibold mb-2">Ads.txt Content</label>
                                            <p className="text-xs text-text-secondary mb-3">
                                                Content for your /ads.txt file.
                                                <a href="/ads.txt" target="_blank" className="text-accent-cyan hover:underline ml-1">Verify here</a>
                                            </p>
                                            <textarea
                                                value={adsTxt}
                                                onChange={(e) => setAdsTxt(e.target.value)}
                                                className="w-full bg-primary-dark border border-white/10 rounded-xl p-4 text-white focus:border-accent-cyan focus:outline-none h-32 font-mono text-sm resize-none"
                                                placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                                            />
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <label className="block text-white font-semibold mb-2">Additional Meta Tags</label>
                                            <p className="text-xs text-text-secondary mb-3">Any other verification meta tags (e.g., Google Search Console).</p>
                                            <textarea
                                                value={metaTags}
                                                onChange={(e) => setMetaTags(e.target.value)}
                                                className="w-full bg-primary-dark border border-white/10 rounded-xl p-4 text-white focus:border-accent-cyan focus:outline-none h-32 font-mono text-sm resize-none"
                                                placeholder='<meta name="google-site-verification" content="..." />'
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                icon={SaveIcon}
                                            >
                                                Save Settings
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Admin;
