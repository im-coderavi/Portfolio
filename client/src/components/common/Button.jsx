import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    iconPosition = 'right',
    isLoading = false,
    ...props
}) => {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden';

    const variants = {
        primary: 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white hover:shadow-lg hover:shadow-accent-cyan/50',
        secondary: 'bg-white/10 dark:bg-white/10 light:bg-gray-200 text-white dark:text-white light:text-gray-900 border border-white/20 dark:border-white/20 light:border-gray-300 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-gray-300',
        ghost: 'text-text-secondary dark:text-text-secondary light:text-gray-700 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100',
        outline: 'border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-primary-dark',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-3.5 text-base',
        lg: 'px-10 py-4 text-lg',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                isLoading && 'opacity-70 cursor-not-allowed',
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon size={20} />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon size={20} />}
                </>
            )}
        </motion.button>
    );
};

export default Button;
