import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqsData } from '../../assets/data/faqs';
import FadeIn from '../animations/FadeIn';

const FAQItem = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <FadeIn direction="up" delay={0.05 * index}>
            <div className="glass rounded-xl overflow-hidden mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
                >
                    <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="text-accent-purple flex-shrink-0" size={24} />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-white/[0.04] pt-4">
                                {faq.answer}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </FadeIn>
    );
};

const FAQ = () => {
    return (
        <section id="faq" className="py-16 sm:py-20 bg-[#050505]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Section Heading */}
                <FadeIn direction="up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Frequently Asked <span className="text-gradient">Questions</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-purple to-accent-cyan mx-auto rounded-full mb-4" />
                        <p className="text-text-secondary text-lg">Got questions? I've got answers</p>
                    </div>
                </FadeIn>

                {/* FAQ Items */}
                <div>
                    {faqsData.map((faq, index) => (
                        <FAQItem key={faq.id} faq={faq} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
