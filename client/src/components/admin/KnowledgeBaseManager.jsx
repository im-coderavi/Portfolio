import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import Button from '../common/Button';
import API_URL from '../../config/api';

const KnowledgeBaseManager = () => {
    const [knowledgeBase, setKnowledgeBase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [pdfFile, setPdfFile] = useState(null);

    const fetchKnowledgeBase = async () => {
        try {
            const password = localStorage.getItem('adminPassword');
            const response = await axios.get(`${API_URL}/api/admin/knowledge-base`, {
                headers: { 'X-Admin-Password': password }
            });
            if (response.data.success) {
                setKnowledgeBase(response.data.knowledgeBase);
            }
        } catch (error) {
            console.error('Failed to fetch knowledge base', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKnowledgeBase();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!title || !pdfFile) {
            alert('Please provide title and PDF file');
            return;
        }

        setUploading(true);
        try {
            const password = localStorage.getItem('adminPassword');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('pdf', pdfFile);

            await axios.post(`${API_URL}/api/admin/knowledge-base/upload`, formData, {
                headers: {
                    'X-Admin-Password': password,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('PDF uploaded successfully!');
            setTitle('');
            setPdfFile(null);
            fetchKnowledgeBase();
        } catch (error) {
            alert('Failed to upload PDF: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this knowledge base item?')) return;

        try {
            const password = localStorage.getItem('adminPassword');
            await axios.delete(`${API_URL}/api/admin/knowledge-base/${id}`, {
                headers: { 'X-Admin-Password': password }
            });
            fetchKnowledgeBase();
        } catch (error) {
            alert('Failed to delete knowledge base item');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-accent-cyan" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Upload className="text-accent-cyan" />
                    Upload PDF to Knowledge Base
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-text-secondary mb-2 font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-primary-dark/50 border border-white/10 rounded-xl p-4 text-white focus:border-accent-cyan focus:outline-none"
                            placeholder="e.g., Company Information, Services Guide"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-text-secondary mb-2 font-medium">PDF File</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files[0])}
                            className="w-full bg-primary-dark/50 border border-white/10 rounded-xl p-4 text-white focus:border-accent-cyan focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-cyan file:text-black file:cursor-pointer"
                            required
                        />
                        <p className="text-xs text-text-secondary mt-2">Max file size: 5MB</p>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Upload}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload PDF'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Knowledge Base List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Knowledge Base Items</h2>
                {knowledgeBase.length === 0 ? (
                    <p className="text-text-secondary text-center py-8">No knowledge base items yet. Upload a PDF to get started!</p>
                ) : (
                    <div className="space-y-4">
                        {knowledgeBase.map((item) => (
                            <div
                                key={item._id}
                                className="bg-primary-dark/50 border border-white/10 rounded-xl p-6 flex items-center justify-between hover:border-accent-cyan/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-accent-cyan/10 rounded-lg">
                                        <FileText className="text-accent-cyan" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                                        <p className="text-text-secondary text-sm">
                                            Uploaded {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent-cyan hover:underline text-sm"
                                    >
                                        View PDF
                                    </a>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBaseManager;
