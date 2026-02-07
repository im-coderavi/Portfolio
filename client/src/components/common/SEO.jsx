import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, name, type = 'website' }) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name="keywords" content={keywords} />

            {/* End of standard metadata tags */}
            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* End of Facebook tags */}
            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* End of Twitter tags */}
        </Helmet>
    );
}

SEO.defaultProps = {
    title: 'Avishek Giri | Full Stack MERN Developer',
    description: 'Full Stack MERN Developer specializing in building scalable web applications with AI integration.',
    keywords: 'Full Stack Developer, MERN Developer, React, Node.js, AI Integration',
    name: 'Avishek Giri',
    type: 'website'
};

export default SEO;
