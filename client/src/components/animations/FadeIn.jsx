import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FadeIn = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className,
    viewport = { once: true, margin: "-100px" },
    staggerChildren = 0
}) => {
    const [ref, inView] = useInView({
        triggerOnce: viewport.once,
        threshold: 0.1,
        rootMargin: viewport.margin
    });

    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
        none: { x: 0, y: 0 }
    };

    const initial = {
        opacity: 0,
        ...directions[direction]
    };

    const animate = {
        opacity: 1,
        x: 0,
        y: 0
    };

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={inView ? animate : initial}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.25, 0, 1] // Custom ease-out curve
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
