import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
    children,
    className = '',
    hover = true,
    gradient = false
}) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5 } : {}}
            className={clsx(
                'glass rounded-2xl p-6 transition-all duration-300',
                'dark:bg-white/5 dark:border-white/10',
                'light:bg-white light:border-gray-200',
                gradient && 'bg-gradient-to-br from-primary-light to-primary-dark',
                hover && 'hover:shadow-lg dark:hover:shadow-accent-cyan/10 light:hover:shadow-gray-300',
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default Card;
