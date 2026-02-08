import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = () => {
    // Person Schema - Professional Profile
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Avishek Giri",
        "alternateName": "CodeRavi",
        "url": "https://coderavi.in",
        "image": "https://coderavi.in/og-image.png",
        "jobTitle": "Full Stack MERN Developer",
        "description": "Full Stack MERN Developer with 2+ years of experience specialized in building scalable web applications with AI integration",
        "knowsAbout": [
            "MERN Stack Development",
            "React.js",
            "Node.js",
            "MongoDB",
            "Express.js",
            "AI Integration",
            "Web Development",
            "JavaScript",
            "React Native",
            "SEO Optimization"
        ],
        "sameAs": [
            "https://www.linkedin.com/in/im-coderavi/",
            "https://github.com/im-coderavi"
        ],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kolkata",
            "addressRegion": "West Bengal",
            "addressCountry": "India"
        },
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Computer Science and Engineering"
        }
    };

    // Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Avishek Giri - Full Stack Developer Portfolio",
        "alternateName": "CodeRavi Portfolio",
        "url": "https://coderavi.in",
        "description": "Professional portfolio of Avishek Giri, a Full Stack MERN Developer specializing in web applications and AI integration",
        "author": {
            "@type": "Person",
            "name": "Avishek Giri"
        },
        "inLanguage": "en-US",
        "copyrightYear": 2026,
        "copyrightHolder": {
            "@type": "Person",
            "name": "Avishek Giri"
        }
    };

    // Professional Service Schema
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Avishek Giri - Freelance Web Development",
        "image": "https://coderavi.in/og-image.png",
        "url": "https://coderavi.in",
        "description": "Professional freelance web development services specializing in MERN stack, AI integration, and scalable web applications",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kolkata",
            "addressRegion": "West Bengal",
            "addressCountry": "India"
        },
        "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
        },
        "serviceType": [
            "Web Development",
            "MERN Stack Development",
            "AI Integration",
            "React Development",
            "Node.js Development",
            "Full Stack Development"
        ]
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://coderavi.in/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": "https://coderavi.in/#about"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Projects",
                "item": "https://coderavi.in/#projects"
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": "Contact",
                "item": "https://coderavi.in/#contact"
            }
        ]
    };

    return (
        <Helmet>
            {/* Person Schema */}
            <script type="application/ld+json">
                {JSON.stringify(personSchema)}
            </script>

            {/* Website Schema */}
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>

            {/* Professional Service Schema */}
            <script type="application/ld+json">
                {JSON.stringify(professionalServiceSchema)}
            </script>

            {/* Breadcrumb Schema */}
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
        </Helmet>
    );
};

export default StructuredData;
