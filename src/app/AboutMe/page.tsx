"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ValorantNavbar from "../../Components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function AboutMe() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0005] text-white overflow-hidden font-['Valorant'] pt-16 md:pt-20">
      {/* Animated gradient light overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-purple-800 blur-[180px] -z-10"
      />

      {/* NAVBAR */}
      <ValorantNavbar />

      {/* MAIN CENTER TEXT */}
      <div className="flex items-center justify-center h-[80vh]">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold text-center text-white tracking-widest"
        >
          Coming soon <span className="text-red-500">;)</span>
        </motion.h1>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm font-['Valorant']">
        © 2025  ANSH TIWARI
      </footer>
    </div>
  );
}
