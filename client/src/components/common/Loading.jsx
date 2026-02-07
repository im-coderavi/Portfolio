import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-40">
            <motion.div
                className="w-10 h-10 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

export default Loading;
