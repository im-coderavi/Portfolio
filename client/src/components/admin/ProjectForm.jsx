import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button';

const ProjectForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        featured: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                technologies: Array.isArray(initialData.technologies)
                    ? initialData.technologies.join(', ')
                    : initialData.technologies
            });
            // Handle existing image for preview
            if (initialData.image) {
                setPreviewUrl(initialData.image.startsWith('http') ? initialData.image : `http://localhost:5000${initialData.image}`);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData for multipart/form-data submission
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('technologies', formData.technologies);
        data.append('liveUrl', formData.liveUrl);
        data.append('githubUrl', formData.githubUrl);
        data.append('featured', formData.featured);

        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image) {
            data.append('image', formData.image); // Keep existing URL if no new file
        }

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Project Image</label>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <label className="flex items-center gap-2 w-full p-2 bg-black/20 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                                <Upload size={20} className="text-accent-cyan" />
                                <span className="text-sm text-text-secondary truncate">
                                    {imageFile ? imageFile.name : 'Choose Image File'}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {previewUrl && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 relative group">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                    {/* Fallback URL input if they really want to use external URL */}
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={(e) => {
                            handleChange(e);
                            if (!imageFile) setPreviewUrl(e.target.value);
                        }}
                        placeholder="Or enter Image URL"
                        className="w-full text-xs bg-transparent border-none text-text-secondary focus:ring-0 p-0 mt-1 placeholder-white/20"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50 resize-none"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Technologies (comma separated)</label>
                <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Live Demo URL</label>
                    <input
                        type="text"
                        name="liveUrl"
                        value={formData.liveUrl}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">GitHub Repository URL</label>
                    <input
                        type="text"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent-cyan/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-white/10 bg-black/20 text-accent-cyan focus:ring-accent-cyan"
                />
                <label htmlFor="featured" className="text-white">Featured Project</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 rounded-xl text-text-secondary hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <Button variant="primary" type="submit" icon={Save}>
                    Save Project
                </Button>
            </div>
        </form>
    );
};

export default ProjectForm;
