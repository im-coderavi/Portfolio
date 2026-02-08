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
import SEOManager from './components/common/SEOManager';
import ChatBot from './components/chatbot/ChatBot';
import StructuredData from './components/common/StructuredData';
import CookieConsent from './components/common/CookieConsent';

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
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

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
    <ChatBot />
    <StructuredData />
  </>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Track visitor on website load (only for main portfolio)
  /* Visitor tracking removed */

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-primary-dark text-white">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loading /></div>}>
          {/* <SEOManager /> */}
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
        <CookieConsent />
      </div>
    </HelmetProvider>
  );
}

export default App;
