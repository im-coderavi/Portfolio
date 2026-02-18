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
        primary: 'bg-gradient-to-r from-accent-purple to-accent-cyan text-white hover:shadow-lg hover:shadow-accent-purple/40 hover:scale-[1.02]',
        secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-accent-purple/50',
        ghost: 'text-text-secondary hover:bg-white/5 hover:text-white',
        outline: 'border-2 border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white',
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
