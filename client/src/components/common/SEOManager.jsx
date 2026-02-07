import React, { useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const SEOManager = () => {
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/public-settings`);
                if (response.data.success) {
                    const { adsenseCode, metaTags } = response.data;

                    // Inject AdSense Code
                    if (adsenseCode) {
                        // Create a temporary container to parse the HTML string
                        const div = document.createElement('div');
                        div.innerHTML = adsenseCode;

                        // Execute scripts found in the content
                        Array.from(div.querySelectorAll('script')).forEach(oldScript => {
                            const newScript = document.createElement('script');
                            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                            document.head.appendChild(newScript);
                        });
                    }

                    // Inject Meta Tags
                    if (metaTags) {
                        const div = document.createElement('div');
                        div.innerHTML = metaTags;

                        Array.from(div.children).forEach(tag => {
                            document.head.appendChild(tag);
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch SEO settings', error);
            }
        };

        fetchSettings();
    }, []);

    return null; // This component doesn't render anything visible
};

export default SEOManager;
