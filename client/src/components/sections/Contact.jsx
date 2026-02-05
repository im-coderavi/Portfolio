import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Globe, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '../common/Card';
import Button from '../common/Button';
import FadeIn from '../animations/FadeIn';
import API_URL from '../../config/api';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    subject: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data) => {
        try {
            // Send form data to backend API
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitStatus('success');
                reset();
                setTimeout(() => setSubmitStatus(null), 5000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 5000);
        }
    };

    const contactInfo = [
        { icon: Mail, label: 'Email', value: 'avishekgiri31@gmail.com', href: 'mailto:avishekgiri31@gmail.com' },
        { icon: Phone, label: 'Phone', value: '+91 9874945320', href: 'tel:+919874945320' },
        { icon: MapPin, label: 'Location', value: 'Kolkata, West Bengal, India', href: null },
    ];

    const socialLinks = [
        { icon: Linkedin, url: 'https://linkedin.com/in/avishekgiri', label: 'LinkedIn' },
        { icon: Github, url: 'https://github.com/avishekgiri', label: 'GitHub' },
        { icon: Globe, url: 'https://avishekgiri.dev', label: 'Portfolio' },
    ];

    return (
        <section id="contact" className="py-20 bg-primary-dark dark:bg-primary-dark light:bg-gray-50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                            Get In Touch
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue mx-auto rounded-full mb-4"></div>
                        <p className="text-text-secondary text-lg">
                            Have a project in mind? Let's work together!
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-[40%_60%] gap-8">
                    {/* Left Side - Contact Info */}
                    <FadeIn direction="right" delay={0.2}>
                        <Card className="p-8 space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    Let's Connect
                                </h3>
                                <p className="text-text-secondary leading-relaxed">
                                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                                            <info.icon className="text-accent-cyan" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-text-muted text-sm">{info.label}</p>
                                            {info.href ? (
                                                <a href={info.href} className="text-white hover:text-accent-cyan transition-colors">
                                                    {info.value}
                                                </a>
                                            ) : (
                                                <p className="text-white">{info.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-text-muted text-sm mb-4">Follow me on</p>
                                <div className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -5 }}
                                            className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan hover:bg-accent-cyan hover:text-primary-dark transition-all"
                                            aria-label={social.label}
                                        >
                                            <social.icon size={20} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="pt-4 space-y-2">
                                <div className="flex items-center gap-2 text-accent-green">
                                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold">Available for freelance work</span>
                                </div>
                                <div className="flex items-center gap-2 text-accent-blue">
                                    <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold">Open to full-time opportunities</span>
                                </div>
                            </div>
                        </Card>
                    </FadeIn>

                    {/* Right Side - Contact Form */}
                    <FadeIn direction="left" delay={0.2}>
                        <Card className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        placeholder="Your Name *"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-accent-cyan focus:outline-none transition-all"
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="Your Email *"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-accent-cyan focus:outline-none transition-all"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <input
                                        {...register('subject')}
                                        type="text"
                                        placeholder="Subject"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-accent-cyan focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <textarea
                                        {...register('message')}
                                        rows="6"
                                        placeholder="Your Message *"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-accent-cyan focus:outline-none transition-all resize-none"
                                    ></textarea>
                                    {errors.message && (
                                        <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    icon={Send}
                                    iconPosition="right"
                                    isLoading={isSubmitting}
                                    className="w-full"
                                >
                                    Send Message
                                </Button>

                                {/* Status Messages */}
                                {submitStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-accent-green bg-accent-green/10 border border-accent-green/20 rounded-xl p-4"
                                    >
                                        <CheckCircle size={20} />
                                        <span>Message sent successfully!</span>
                                    </motion.div>
                                )}

                                {submitStatus === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4"
                                    >
                                        <XCircle size={20} />
                                        <span>Failed to send message. Please try again.</span>
                                    </motion.div>
                                )}
                            </form>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default Contact;
