"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ValorantName() {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => router.push("/Home"), 1000); // Navigate after fade
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <AnimatePresence>
        {!clicked && (
          <motion.h1
            onClick={handleClick}
            whileHover={{ scale: 1.25 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 2,
              transition: { duration: 1, ease: "easeInOut" },
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-white font-bold tracking-widest cursor-pointer select-none
                       text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center font-['VALORANT']"
          >
            ANSH&nbsp;TIWARI
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
}
