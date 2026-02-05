import { useInView as useInViewObserver } from 'react-intersection-observer';

const useInView = (options = {}) => {
    const { threshold = 0.1, triggerOnce = true, ...rest } = options;

    const [ref, inView] = useInViewObserver({
        threshold,
        triggerOnce,
        ...rest
    });

    return [ref, inView];
};

export default useInView;
