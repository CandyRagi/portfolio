"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const roles = [
    { title: "Recruiter", src: "/images/recruiter.png" },
    { title: "Developer", src: "/images/developer.png" },
    { title: "Stalker", src: "/images/stalker.png" },
    { title: "Adventurer", src: "/images/adventurer.png" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-['Valorant'] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative">
      {/* HERO TEXT */}
      <div className="text-center mt-8 sm:mt-12 md:mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-widest leading-tight"
        >
          WELCOME&nbsp;<span className="text-red-600">AGENT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 px-4"
        >
          Who&apos;s in the queue this time?
        </motion.p>
      </div>

      {/* IMAGE GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl w-full"
      >
        {roles.map((role, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push("/Home")}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 overflow-hidden rounded-lg shadow-lg border-2 border-transparent group-hover:border-red-500 transition-all duration-300">
              <Image
                src={role.src}
                alt={role.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg tracking-widest group-hover:text-red-500 transition-colors duration-300 text-center">
              {role.title}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}