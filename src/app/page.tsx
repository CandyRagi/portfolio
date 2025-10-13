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
    <div className="min-h-screen bg-black text-white overflow-hidden font-['Valorant'] flex flex-col items-center justify-center px-6 relative">
      {/* HERO TEXT */}
      <div className="text-center mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-widest"
        >
          WELCOME&nbsp;<span className="text-red-600">AGENT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-400"
        >
          Who&apos;s in the queue this time?
        </motion.p>
      </div>

      {/* IMAGE GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {roles.map((role, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push("/Home")} // 👈 redirect on click
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="relative w-40 h-40 md:w-52 md:h-52 overflow-hidden rounded-lg shadow-lg  group-hover:border-red-500 transition-all duration-300">
              <Image
                src={role.src}
                alt={role.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="mt-3 text-lg tracking-widest group-hover:text-red-500 transition-colors duration-300">
              {role.title}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
