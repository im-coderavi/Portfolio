/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    dark: '#000000',      // Pure Black - Main Background
                    darker: '#050505',    // Near Black - Alternate Sections
                    light: '#0f0f0f',     // Very Dark Gray - Cards/Elements
                },
                accent: {
                    cyan: '#00D4FF',      // Electric Cyan
                    blue: '#3B82F6',      // Bright Blue
                    purple: '#7C3AED',    // Vivid Violet
                    pink: '#EC4899',      // Hot Pink
                    orange: '#F97316',    // Vibrant Orange
                    green: '#10B981',     // Emerald Green
                    violet: '#8B5CF6',    // Soft Violet
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A1A1AA',
                    muted: '#52525B',
                }
            },
            fontFamily: {
                display: ['Outfit', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-purple': '0 0 20px rgba(124, 58, 237, 0.4)',
                'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
                'glow-sm': '0 0 10px rgba(124, 58, 237, 0.2)',
            }
        },
    },
    plugins: [],
}
