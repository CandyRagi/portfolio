"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 3D Tilt Card Component
function TiltCard({ role, index, onClick }: { role: { title: string; src: string }; index: number; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 1 + index * 0.15,
        duration: 0.6,
        ease: [0.0, 0.0, 0.2, 1] as const
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group perspective-1000"
    >
      <motion.div
        className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 overflow-hidden rounded-lg shadow-lg border-2 border-transparent group-hover:border-red-500 transition-all duration-300"
        style={{ transform: "translateZ(50px)" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src={role.src}
          alt={role.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Shimmer overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-red-600/40 via-transparent to-transparent" />
      </motion.div>
      <motion.p
        className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg tracking-widest group-hover:text-red-500 transition-colors duration-300 text-center"
        style={{ transform: "translateZ(30px)" }}
      >
        {role.title}
      </motion.p>
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const roles = [
    { title: "Recruiter", src: "/images/recruiter.png" },
    { title: "Developer", src: "/images/developer.png" },
    { title: "Stalker", src: "/images/stalker.png" },
    { title: "Adventurer", src: "/images/adventurer.png" },
  ];

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.0, 0.0, 0.2, 1] as const,
      },
    }),
  };

  const welcomeText = "WELCOME";
  const agentText = "AGENT";

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-['Valorant'] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative">
      {/* HERO TEXT with letter-by-letter animation */}
      <div className="text-center mt-8 sm:mt-12 md:mt-16 relative z-10">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-widest leading-tight flex justify-center flex-wrap"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* WELCOME letters */}
          {welcomeText.split("").map((letter, i) => (
            <motion.span
              key={`welcome-${i}`}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className={`inline-block ${isHovering ? 'animate-glitch' : ''}`}
              whileHover={{
                scale: 1.2,
                color: "#ef4444",
                transition: { duration: 0.1 }
              }}
            >
              {letter}
            </motion.span>
          ))}
          <span className="mx-2">&nbsp;</span>
          {/* AGENT letters */}
          {agentText.split("").map((letter, i) => (
            <motion.span
              key={`agent-${i}`}
              custom={i + welcomeText.length + 1}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-red-600 inline-block"
              whileHover={{
                scale: 1.2,
                textShadow: "0 0 20px rgba(220, 38, 38, 0.8)",
                transition: { duration: 0.1 }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.0, 0.0, 0.2, 1] as const }}
          className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 px-4"
        >
          Who&apos;s in the queue this time?
        </motion.p>
      </div>

      {/* IMAGE GRID with 3D Tilt Cards */}
      <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl w-full relative z-10">
        {roles.map((role, index) => (
          <TiltCard
            key={index}
            role={role}
            index={index}
            onClick={() => router.push("/Home")}
          />
        ))}
      </div>

      {/* Animated floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main floating orbs with breathing animation */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-red-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-red-600/20 rounded-full blur-3xl"
        />

        {/* Additional floating particles */}
        <motion.div
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-600/15 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-orange-600/15 rounded-full blur-2xl"
        />
      </div>
    </div>
  );
}