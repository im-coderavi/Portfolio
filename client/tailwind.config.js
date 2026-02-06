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
                    dark: '#0A0E27',
                    darker: '#060913',
                    light: '#1A1F3A',
                },
                accent: {
                    cyan: '#00F5FF',
                    blue: '#0066FF',
                    purple: '#7C3AED',
                    pink: '#FF006E',
                    orange: '#FF6B35',
                    green: '#10B981',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#B4BCD0',
                    muted: '#6B7280',
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
            }
        },
    },
    plugins: [],
}
