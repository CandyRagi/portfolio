"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ValorantNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/Home" },
    { name: "PROJECTS", href: "/Projects" },
    { name: "BLOG", href: "/Blog" },
    { name: "Links", href: "/Links" },
  ];

  // Staggered animation variants for nav links
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1] as const }
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: { duration: 0.3 }
    },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav className="fixed top-3 left-0 w-full text-white font-['VALORANT'] z-[9999]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group">
          <motion.span
            className="text-3xl font-bold tracking-widest"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-red-500 group-hover:text-white transition-colors duration-300">ANSH</span>
            <span className="text-white group-hover:text-red-500 transition-colors duration-300">TIWARI</span>
          </motion.span>
        </Link>

        {/* Desktop menu with staggered animations */}
        <motion.div
          className="hidden md:flex gap-8 text-lg tracking-widest"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <motion.div key={link.name} variants={linkVariants}>
                <Link href={link.href} className="relative group">
                  <motion.span
                    className={`transition-colors duration-200 ${isActive ? "text-red-500" : "group-hover:text-red-500"}`}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {link.name}
                  </motion.span>
                  {/* Animated underline */}
                  <motion.span
                    className="absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: isActive ? "100%" : "0%" }}
                    animate={{ width: isActive ? "100%" : "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Animated Hamburger Menu */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none"
        >
          <motion.span
            className="absolute w-6 h-0.5 bg-white rounded-full"
            animate={{
              rotate: open ? 45 : 0,
              y: open ? 0 : -6,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute w-6 h-0.5 bg-white rounded-full"
            animate={{
              opacity: open ? 0 : 1,
              scaleX: open ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute w-6 h-0.5 bg-white rounded-full"
            animate={{
              rotate: open ? -45 : 0,
              y: open ? 0 : 6,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </button>
      </div>

      {/* Mobile dropdown with enhanced animations */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-black/95 backdrop-blur-lg border-t-2 border-red-600 px-6 py-4 space-y-4 text-center overflow-hidden"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  variants={mobileLinkVariants}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block text-lg tracking-widest transition py-2 ${isActive ? "text-red-500" : "hover:text-red-500"
                      }`}
                  >
                    <motion.span
                      whileHover={{ x: 10, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="inline-block"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
