import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PackageSection from '../components/PackageSection';
import EditingSection from '../components/EditingSection';
import Testimonials from '../components/Testimonials';
import { motion } from 'motion/react';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <Features />
      <PackageSection />
      <EditingSection />
      <Testimonials />
    </motion.div>
  );
};

export default Home;
