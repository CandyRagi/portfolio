"use client";
import { motion } from "framer-motion";
import ValorantNavbar from "@/Components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-['VALORANT'] relative">
      {/* NAVBAR */}
      <ValorantNavbar />

      {/* HERO SECTION */}
      <section className="flex flex-col justify-center items-center text-center h-screen px-6">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-8xl tracking-widest font-bold"
        >
          WELCOME&nbsp;<span className="text-red-500">AGENT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl"
        >
          Precision. Strategy. Firepower. Step into the world of <span className="text-white font-semibold">Valorant-style</span> innovation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 flex gap-6 flex-wrap justify-center"
        >
          <Link
            href="/projects"
            className="relative px-8 py-3 bg-red-600 uppercase tracking-widest hover:bg-red-700 transition font-semibold text-white shadow-lg"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="relative px-8 py-3 border-2 border-red-600 uppercase tracking-widest hover:bg-red-600 transition font-semibold text-white"
          >
            About Me
          </Link>
        </motion.div>
      </section>

      {/* BACKGROUND SHAPES */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* diagonal red glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1.5 }}
          className="absolute w-[400px] h-[400px] bg-red-600 blur-[150px] rotate-45 top-1/4 left-[-100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="absolute w-[400px] h-[400px] bg-red-800 blur-[200px] rotate-45 bottom-1/4 right-[-100px]"
        />
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm border-t border-red-700">
        © 2025 ANSH TIWARI&nbsp;–&nbsp;Valorant-Inspired UI
      </footer>
    </div>
  );
}
