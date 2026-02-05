import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import API_URL from './config/api';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Education from './components/sections/Education';
import FAQ from './components/sections/FAQ';
import Contact from './components/sections/Contact';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';

const Portfolio = () => (
  <>
    <ScrollProgress />
    <Navbar />
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <FAQ />
      <Contact />
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
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}

export default App;
