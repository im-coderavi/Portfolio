import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config/api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [showConfirmForm, setShowConfirmForm] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        budget: '',
        timeline: ''
    });
    const messagesEndRef = useRef(null);

    // Format message with basic markdown support
    const formatMessage = (content) => {
        if (!content) return '';

        // Convert **bold** to <strong>
        let formatted = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Convert *italic* to <em> (single asterisk)
        formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

        // Convert bullet points (• or -) at start of line
        formatted = formatted.replace(/^[•\-]\s+/gm, '• ');

        return formatted;
    };

    // Generate or retrieve session ID
    useEffect(() => {
        let sid = localStorage.getItem('chatSessionId');
        if (!sid) {
            sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('chatSessionId', sid);
        }
        setSessionId(sid);

        // Load conversation history
        loadHistory(sid);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load conversation history
    const loadHistory = async (sid) => {
        try {
            const response = await axios.get(`${API_URL}/api/chat/history/${sid}`);
            if (response.data.success && response.data.messages.length > 0) {
                setMessages(response.data.messages);
            } else {
                // Welcome message
                setMessages([{
                    role: 'assistant',
                    content: 'Hi! I\'m Avishek\'s AI assistant. Feel free to ask me anything about his skills, experience, or projects. How can I help you today?',
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/chat/message`, {
                sessionId,
                message: inputMessage
            });

            if (response.data.success) {
                const botMessage = {
                    role: 'assistant',
                    content: response.data.message,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Create Deal / Confirm Project
    const createDeal = async () => {
        if (!userInfo.name || !userInfo.email) {
            alert('Please provide your name and email');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/chat/create-deal`, {
                sessionId,
                userInfo,
                projectDetails: messages.filter(m => m.role === 'user').map(m => m.content).join('\n') || 'New project inquiry',
                budget: userInfo.budget,
                timeline: userInfo.timeline
            });

            if (response.data.success) {
                setShowConfirmForm(false);
                const confirmMessage = {
                    role: 'assistant',
                    content: '🎉 Thank you! Your project inquiry has been received. I have created a deal for you, and Avishek will review it and reach out to you soon via email!',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, confirmMessage]);
                // Reset form but keep name/email for convenience
                setUserInfo(prev => ({ ...prev, budget: '', timeline: '' }));
            }
        } catch (error) {
            console.error('Failed to create deal:', error);
            alert('Failed to submit inquiry. Please try again.');
        }
    };

    // Clear chat history
    const clearChat = () => {
        if (window.confirm('Are you sure you want to clear the chat?')) {
            // Generate new session ID
            const newSid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('chatSessionId', newSid);
            setSessionId(newSid);

            // Reset messages to welcome message
            setMessages([{
                role: 'assistant',
                content: 'Hi! I\'m Avishek\'s AI assistant. Feel free to ask me anything about his skills, experience, or projects. How can I help you today?',
                timestamp: new Date()
            }]);

            // Reset form
            setShowConfirmForm(false);
            setUserInfo({ name: '', email: '', phone: '', budget: '', timeline: '' });
        }
    };

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed z-50 p-4 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-full shadow-2xl hover:shadow-accent-cyan/50 transition-all bottom-6 right-6 sm:bottom-6 sm:right-6"
                        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                    >
                        <MessageCircle size={28} className="sm:w-7 sm:h-7 w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed z-50 bg-primary-dark border border-white/10 shadow-2xl flex flex-col overflow-hidden
                            inset-0 w-full h-full rounded-none
                            sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:w-[400px] sm:h-[600px] sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100vh-2rem)] sm:rounded-2xl"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-accent-cyan to-accent-blue p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Assistant</h3>
                                    <p className="text-xs text-white/80">Ask me about Avishek</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearChat}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Clear Chat"
                                >
                                    <Trash2 className="text-white" size={18} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="text-white" size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary-darker">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot size={16} className="text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] p-3 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white'
                                            : 'bg-white/5 text-text-primary border border-white/10'
                                            }`}
                                    >
                                        <p
                                            className="text-sm whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                        />
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User size={16} className="text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 justify-start">
                                    <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-full flex items-center justify-center">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                        <Loader2 className="animate-spin text-accent-cyan" size={20} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Create Deal Form */}
                        {showConfirmForm && (
                            <div className="p-4 bg-primary-light border-t border-white/10 max-h-[300px] overflow-y-auto">
                                <h4 className="text-sm font-semibold text-white mb-3">Tell me about your project</h4>
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                    className="w-full mb-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email *"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                    className="w-full mb-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone (Optional)"
                                    value={userInfo.phone}
                                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                    className="w-full mb-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan"
                                />
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Budget (e.g. $1k-5k)"
                                        value={userInfo.budget}
                                        onChange={(e) => setUserInfo({ ...userInfo, budget: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Timeline (e.g. 1 month)"
                                        value={userInfo.timeline}
                                        onChange={(e) => setUserInfo({ ...userInfo, timeline: e.target.value })}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-cyan"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={createDeal}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                                    >
                                        Submit Inquiry
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmForm(false)}
                                        className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 bg-primary-light border-t border-white/10">
                            {!showConfirmForm && (
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => setShowConfirmForm(true)}
                                        className="px-3 py-1 bg-gradient-to-r from-accent-cyan/20 to-accent-blue/20 border border-accent-cyan/30 text-accent-cyan rounded-lg text-xs font-semibold hover:bg-accent-cyan/30 transition-colors"
                                    >
                                        💼 Interested in Working Together?
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent-cyan disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="p-3 bg-gradient-to-r from-accent-cyan to-accent-blue text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
