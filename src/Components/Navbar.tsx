"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // 👈 added

export default function ValorantNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // 👈 get current route

  const navLinks = [
    { name: "HOME", href: "/Home" },
    { name: "PROJECTS", href: "/Projects" },
    { name: "JOURNEY", href: "/Journey" },
    { name: "BLOG", href: "/Blog" },
    { name: "CONTACT", href: "/Contact" },
  ];

  return (
    <nav className="fixed top-3 left-0 w-full text-white font-['VALORANT'] z-[9999]">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold tracking-widest text-red-500 hover:text-white transition"
        >
          ANSH<span className="text-white">TIWARI</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-8 text-lg tracking-widest">
          {navLinks.map((link) => {
            const isActive = pathname === link.href; // 👈 active check
            return (
              <Link key={link.name} href={link.href} className="relative group">
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? "text-red-500" : "group-hover:text-red-500"
                  }`}
                >
                  {link.name}
                </span>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-red-500 transition-all ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black border-t-2 border-red-600 px-6 py-4 space-y-4 text-center"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href; // 👈 active check
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block text-lg tracking-widest transition ${
                    isActive ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
