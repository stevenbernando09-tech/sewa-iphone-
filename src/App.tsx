import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import About from './pages/About';
import SlideStudio from './pages/SlideStudio';
import AuthCallback from './pages/AuthCallback';
import { AnimatePresence } from 'motion/react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  React.useEffect(() => {
    let audioCtx: AudioContext | null = null;

    const playClickSound = () => {
      try {
        // Initialize AudioContext on demand because of browser security policies
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
        }

        if (!audioCtx) return;

        // Resume if suspended by browser autoplay policy
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // High-quality modern wooden/digital organic click tone
        // Synthesized with custom frequency pitch dive from high-pitch to mid-range
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);

        // Micro amplitude volume envelope: instant jump and rapid exponential fade out
        gainNode.gain.setValueAtTime(0.04, now); // keep it subtle and elegant
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {
        // Silently catch errors caused by browser constraints
      }
    };

    const handleGlobalClick = () => {
      playClickSound();
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/about" element={<About />} />
              <Route path="/slides" element={<SlideStudio />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
