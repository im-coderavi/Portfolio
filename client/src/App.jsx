import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import API_URL from './config/api';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import Hero from './components/sections/Hero';
import SEO from './components/common/SEO';
import Loading from './components/common/Loading';

// Lazy load heavy sections
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Education = lazy(() => import('./components/sections/Education'));
const FAQ = lazy(() => import('./components/sections/FAQ'));
const Contact = lazy(() => import('./components/sections/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Admin = lazy(() => import('./pages/Admin'));

const Portfolio = () => (
  <>
    <SEO
      title="Avishek Giri | Full Stack MERN Developer | AI Integration Specialist"
      description="Avishek Giri - Full Stack MERN Developer with 2+ years of experience. specialized in building scalable web applications with AI integration. View my portfolio and projects."
      keywords="Full Stack Developer, MERN Developer, React Developer, Node.js, AI Integration, Avishek Giri, Web Development, Portfolio"
    />
    <ScrollProgress />
    <Navbar />
    <main>
      <Hero />
      <Suspense fallback={<Loading />}>
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <FAQ />
        <Contact />
      </Suspense>
    </main>
    <Footer />
  </>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Track visitor on website load (only for main portfolio)
  useEffect(() => {
    if (!isAdminRoute) {
      const trackVisitor = async () => {
        try {
          await fetch(`${API_URL}/api/visitor`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              referrer: document.referrer,
              language: navigator.language,
            }),
          });
        } catch (error) {
          console.log('Visitor tracking failed:', error);
        }
      };
      trackVisitor();
    }
  }, [isAdminRoute]);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-primary-dark text-white">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loading /></div>}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
      </div>
    </HelmetProvider>
  );
}

export default App;
