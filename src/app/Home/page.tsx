"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ValorantNavbar from "@/Components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Staggered text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.0, 0.0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0005] text-white overflow-hidden font-['Valorant']">
      {/* Animated gradient light overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-purple-800 blur-[180px] -z-10"
      />

      {/* NAVBAR */}
      <ValorantNavbar />

      {/* SECTION 1 - Main Content */}
      <section className="flex flex-col md:flex-row justify-center items-center min-h-screen px-8 md:px-24 gap-20 md:gap-32 pt-20">
        {/* LEFT SIDE IMAGE with Parallax */}
        <motion.div
          key={`image-${isLoaded}`}
          initial={{ opacity: 0, x: -80, scale: 0.8, rotateY: -15 }}
          animate={isLoaded ? { opacity: 1, x: 0, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.0, 0.0, 0.2, 1] as const }}
          style={{ y: parallaxY }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px]"
        >
          {/* Animated ring around image */}
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-red-500/30"
            animate={{
              rotate: 360,
              scale: [1, 1.02, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute -inset-8 rounded-full border border-purple-500/20"
            animate={{
              rotate: -360,
              scale: [1, 1.03, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Main Image Container */}
          <motion.div
            className="relative w-full h-full rounded-full overflow-hidden"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 60px rgba(220, 38, 38, 0.4)",
            }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/images/profile.jpeg"
              alt="Ansh Tiwari"
              fill
              className="object-cover"
              priority
            />
            {/* Hover glow overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-red-600/20 via-transparent to-transparent opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE TEXT with staggered animation */}
        <motion.div
          key={`text-${isLoaded}`}
          initial={{ opacity: 0, x: 80 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.0, 0.0, 0.2, 1] as const }}
          className="max-w-xl text-center md:text-left font-sans pt-10"
        >
          <motion.p
            className="text-gray-400 text-sm uppercase tracking-widest mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Software Engineering Student
          </motion.p>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-3 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Hello I&apos;m <br />
            <motion.span
              className="font-['Valorant'] text-red-500 inline-block"
              whileHover={{
                scale: 1.02,
                textShadow: "0 0 30px rgba(220, 38, 38, 0.5)",
              }}
              transition={{ duration: 0.2 }}
            >
              Ansh&nbsp;Tiwari
            </motion.span>
          </motion.h1>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <motion.p className="text-gray-300 text-lg leading-relaxed">
              {["Fedora KDE User & Full-Stack Developer", "|", "A pragmatic, delivery-oriented professional driven by curiosity",
                "and a commitment to excellence.", "I'm passionate about crafting high-performance applications that fuse"].map((word, i) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block mr-1">
                    {word === "|" ? <br /> : word + " "}
                  </motion.span>
                ))}
              <motion.span variants={wordVariants} className="inline-block text-white font-semibold"> design </motion.span>
              <motion.span variants={wordVariants} className="inline-block">and</motion.span>
              <motion.span variants={wordVariants} className="inline-block text-white font-semibold"> functionality</motion.span>
              <motion.span variants={wordVariants} className="inline-block">,</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-1"> creating experiences that feel intuitive and purposeful.</motion.span>
            </motion.p>
          </motion.div>

          {/* BUTTONS with enhanced hover */}
          <motion.div
            className="mt-10 flex flex-wrap gap-6 justify-center md:justify-start items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/Projects">
              <motion.span
                className="group text-lg font-['Valorant'] tracking-widest uppercase text-red-500 hover:text-red-400 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                View Projects
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⟶
                </motion.span>
              </motion.span>
            </Link>

            <Link href="/Ansh_Resume.pdf" download>
              <motion.span
                className="px-8 py-3 font-['Valorant'] uppercase tracking-widest rounded-full border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white hover:border-transparent transition-all duration-300 inline-block cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(220, 38, 38, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                RESUME ⬇
              </motion.span>
            </Link>
          </motion.div>

          {/* SOCIAL LINKS with glow effect */}
          <motion.div
            className="mt-8 flex gap-6 justify-center md:justify-start items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {[
              { href: "https://github.com/CandyRagi", label: "GitHub", path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
              { href: "https://twitter.com/yourusername", label: "Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { href: "https://www.instagram.com/candy.exe22/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { href: "https://www.linkedin.com/in/ansh-tiwari-a19986202/", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
            ].map((social, i) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label={social.label}
              >
                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center transition-all duration-300 group-hover:border-red-500"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.3)", "0 0 0px rgba(239,68,68,0)"],
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, delay: i * 0.3 },
                    scale: { duration: 0.2 }
                  }}
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                  </svg>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ENHANCED FLOATING BACKGROUND LIGHTS */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          opacity: [0.15, 0.4, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute w-[450px] h-[450px] bg-red-700/40 blur-[200px] rounded-full top-1/4 left-[-120px] -z-10"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.15, 1],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute w-[450px] h-[450px] bg-purple-800/40 blur-[200px] rounded-full bottom-1/4 right-[-120px] -z-10"
      />
      {/* Extra floating particle */}
      <motion.div
        animate={{
          y: [0, -50, 0],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
        className="absolute w-[200px] h-[200px] bg-orange-600/20 blur-[100px] rounded-full top-1/2 right-1/4 -z-10"
      />

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm font-['Valorant'] z-20">
        © 2025 ANSH TIWARI
      </footer>
    </div>
  );
}