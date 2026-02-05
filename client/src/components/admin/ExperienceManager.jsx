import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Trash2, Edit, Briefcase, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import Button from '../common/Button';
import FadeIn from '../animations/FadeIn';

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        location: '',
        technologies: ''
    });

    const fetchExperiences = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/experiences');
            if (response.data.success) {
                setExperiences(response.data.experiences);
            }
        } catch (error) {
            console.error('Failed to fetch experiences', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const dataToSend = {
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (editingExperience) {
                await axios.put(
                    `http://localhost:5000/api/admin/experiences/${editingExperience._id}`,
                    dataToSend,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:5000/api/admin/experiences',
                    dataToSend,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            fetchExperiences();
            resetForm();
        } catch (error) {
            alert('Failed to save experience: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (experience) => {
        setEditingExperience(experience);
        setFormData({
            company: experience.company,
            position: experience.position,
            startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
            endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
            current: experience.current,
            description: experience.description || '',
            location: experience.location || '',
            technologies: experience.technologies.join(', ')
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExperiences();
        } catch (error) {
            alert('Failed to delete experience');
        }
    };

    const resetForm = () => {
        setFormData({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            location: '',
            technologies: ''
        });
        setShowForm(false);
        setEditingExperience(null);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-accent-cyan" size={40} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Experience Manager</h2>
                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    Add Experience
                </Button>
            </div>

            {showForm && (
                <FadeIn>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                        <h3 className="text-xl font-bold text-white mb-6">
                            {editingExperience ? 'Edit Experience' : 'New Experience'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                        placeholder="e.g., Google"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Position/Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        disabled={formData.current}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                        placeholder="e.g., San Francisco, CA"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="current"
                                            checked={formData.current}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-accent-cyan focus:ring-accent-cyan focus:ring-offset-0"
                                        />
                                        <span className="ml-3 text-white font-medium">Currently Working Here</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                                    placeholder="Describe your role and responsibilities..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Technologies (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="technologies"
                                    value={formData.technologies}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                    placeholder="e.g., React, Node.js, MongoDB"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" variant="primary">
                                    {editingExperience ? 'Update Experience' : 'Add Experience'}
                                </Button>
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </FadeIn>
            )}

            <div className="space-y-4">
                {experiences.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                        <Briefcase className="mx-auto mb-4 text-text-secondary" size={48} />
                        <p className="text-text-secondary">No experiences added yet</p>
                    </div>
                ) : (
                    experiences.map((exp) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent-cyan/50 transition-colors group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{exp.position}</h3>
                                            <div className="flex items-center gap-4 text-text-secondary text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Briefcase size={16} />
                                                    {exp.company}
                                                </span>
                                                {exp.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={16} />
                                                        {exp.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(exp)}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-accent-cyan hover:text-black transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp._id)}
                                                className="p-2 bg-white/10 rounded-lg hover:bg-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-accent-cyan mb-3">
                                        <Calendar size={16} />
                                        <span>
                                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </span>
                                        {exp.current && (
                                            <span className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan rounded-md text-xs font-medium">
                                                Current
                                            </span>
                                        )}
                                    </div>

                                    {exp.description && (
                                        <p className="text-text-secondary text-sm mb-3 leading-relaxed">
                                            {exp.description}
                                        </p>
                                    )}

                                    {exp.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs px-3 py-1 rounded-full bg-white/5 text-accent-cyan border border-white/10"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExperienceManager;
