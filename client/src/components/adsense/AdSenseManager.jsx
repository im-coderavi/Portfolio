import React, { useEffect } from 'react';

const AdSenseManager = () => {
    useEffect(() => {
        // Only load AdSense script if not already loaded
        if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8414925390417908';
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);

            // Handle script load errors
            script.onerror = () => {
                console.warn('AdSense script failed to load');
            };
        }
    }, []);

    return null; // This component doesn't render anything
};

export default AdSenseManager;
