"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ValorantNavbar from "../../Components/Navbar";
import { ChevronDown } from "lucide-react";

export default function AboutMe() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const scrollToNext = () => {
    if (currentSection === 0) {
      setCurrentSection(1);
    }
  };

  const scrollToPrevious = () => {
    if (currentSection === 1) {
      setCurrentSection(0);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentSection === 0) {
        scrollToNext();
      } else if (e.deltaY < 0 && currentSection === 1) {
        scrollToPrevious();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSection]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0005] text-white overflow-hidden font-['Valorant']">
      {/* Animated gradient light overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-purple-800 blur-[180px] -z-10"
      />

      {/* NAVBAR */}
      <ValorantNavbar />

      {/* SECTION 1 - Coming Soon */}
      <motion.div
        initial={{ rotateX: 0, z: 0 }}
        animate={{
          rotateX: currentSection === 1 ? -90 : 0,
          z: currentSection === 1 ? -500 : 0,
          opacity: currentSection === 1 ? 0 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
        className="relative flex flex-col items-center justify-center h-screen pt-16 md:pt-20"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold text-center text-white tracking-widest"
        >
          Coming soon <span className="text-red-500">;)</span>
        </motion.h1>

        {/* Animated Arrow Down Button */}
        {currentSection === 0 && (
          <motion.button
            onClick={scrollToNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 15, 0] }}
            transition={{
              opacity: { delay: 1, duration: 0.5 },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group"
          >
            <ChevronDown
              size={32}
              className="text-white/70 group-hover:text-red-500 transition-colors"
            />
          </motion.button>
        )}
      </motion.div>

      {/* SECTION 2 - About Content */}
      <motion.div
        initial={{ rotateX: 90, z: -500 }}
        animate={{
          rotateX: currentSection === 1 ? 0 : 90,
          z: currentSection === 1 ? 0 : -500,
          opacity: currentSection === 1 ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", transformOrigin: "center top" }}
        className="absolute inset-0 flex flex-col items-center justify-center h-screen pt-16 md:pt-20 px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: currentSection === 1 ? 1 : 0, y: currentSection === 1 ? 0 : 50 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
            I'm a passionate developer and creative enthusiast. This space is under construction, 
            but soon you'll discover my journey, projects, and the things that inspire me.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-3 bg-red-600/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <span className="text-red-400 font-semibold">Developer</span>
            </div>
            <div className="px-6 py-3 bg-purple-600/20 border border-purple-500/50 rounded-lg backdrop-blur-sm">
              <span className="text-purple-400 font-semibold">Creator</span>
            </div>
            <div className="px-6 py-3 bg-pink-600/20 border border-pink-500/50 rounded-lg backdrop-blur-sm">
              <span className="text-pink-400 font-semibold">Dreamer</span>
            </div>
          </div>
        </motion.div>

        {/* Arrow Up Button */}
        <motion.button
          onClick={scrollToPrevious}
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSection === 1 ? 1 : 0, y: [0, -15, 0] }}
          transition={{
            opacity: { delay: 0.8, duration: 0.5 },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-24 md:top-28 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group rotate-180"
        >
          <ChevronDown
            size={32}
            className="text-white/70 group-hover:text-red-500 transition-colors"
          />
        </motion.button>
      </motion.div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm font-['Valorant'] z-20">
        © 2025 ANSH TIWARI
      </footer>
    </div>
  );
}