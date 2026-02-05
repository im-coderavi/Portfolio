import React from 'react';
import { motion } from 'framer-motion';
import useInView from '../../hooks/useInView';

const ScrollAnimation = ({
    children,
    className,
    delay = 0,
    staggerChildren = 0.1
}) => {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay,
                staggerChildren,
                delayChildren: delay
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.25, 0, 1]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div key={index} variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ScrollAnimation;
