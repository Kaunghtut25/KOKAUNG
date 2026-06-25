'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient — placeholder for hero video/image */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(0,245,212,0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(155,93,229,0.2) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-4"
        >
          Heaven on the Clouds
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
        >
          A9 Global{' '}
          <span className="neon-glow text-neon-cyan">Travels & Tours</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-sky-100 mb-10 max-w-2xl mx-auto"
        >
          Future-built luxury journeys through neon-lit landscapes and cloud-kissed horizons
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/tours" className="btn-gold text-lg">
            Explore Tours
          </Link>
          <Link href="/destinations" className="btn-outline-gold border-white text-white hover:bg-white hover:text-sky-900">
            View Destinations
          </Link>
        </motion.div>
      </div>

      {/* Decorative cloud layer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cloud-white to-transparent" />
    </section>
  );
}
