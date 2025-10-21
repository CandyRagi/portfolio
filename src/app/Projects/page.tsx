"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";
import { BookOpen, ChevronDown, ExternalLink, Github } from "lucide-react";
import ValorantNavbar from "@/Components/Navbar";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github: string;
  Readme: string;
  animation: string;
  bgGradient: string;
  accentColor: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "UniMan",
    subtitle:
      "A progressive web app for Store/Site Material management for Construction purposes primarily",
    description:
      "UniMan is a progressive web application designed to streamline the management of construction materials for stores and sites. It offers features such as inventory tracking, order management, and real-time updates, ensuring efficient material handling and reducing delays in construction projects.",
    tags: ["NextJS", "Firebase", "Express", "TypeScript React", "TailwindCSS"],
    image: "gradient",
    link: "https://oneman-alpha.vercel.app/",
    github: "https://github.com/CandyRagi/oneman",
    Readme: "#",
    animation: "slideScale",
  
    bgGradient: "from-black via-[#0a0a0a] to-[#1a0005]",
    accentColor: "from-red-700 via-pink-600 to-purple-800",
  },
  {
    id: 2,
    title: "FAM APP",
    subtitle: "Cross Platform Music Application",
    description:
      "Fam App is a cross-platform music application that allows users to stream, download, and share their favorite tracks. Built with React Native and integrated with Spotify API for a seamless music experience.",
    tags: ["React-Native", "Spring Boot", "TypeScript", "MongoDB"],
    image: "gradient",
    link: "#",
    github: "https://github.com/CandyRagi/famapp.git",
    Readme: "#",
    animation: "tiles",
    bgGradient: "from-slate-900 via-purple-900 to-black",
    accentColor: "from-cyan-500 via-blue-600 to-purple-700",
    
  },
  {
    id: 3,
    title: "Rizzervit",
    subtitle: "A movie booking website",
    description: "Rizzervit is a movie booking website that allows users to browse and book tickets for movies at various theaters. It features a user-friendly interface, real-time seat selection, and Rizz +1000 perk.",
    tags: ["Spring Boot", "Java", "JavaScript", "MySQL", "Thymeleaf"],
    image: "gradient",
    link: "#",
    github: "https://github.com/kab1rs1dhu/rizzervit.git",
    Readme: "#",
    animation: "fadeRotate",
    bgGradient: "from-green-950 via-emerald-900 to-black",
    accentColor: "from-green-400 via-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "Territory Control Game",
    subtitle: "A 2D territory control game using ",
    description: "It is a JavaFx Application that uses Sockets to create a 2D territory control game. Players can control territories, build structures, and compete against each other in real-time on  local network.",
    tags: ["JavaFx", "TCP/IP", "MVC","Multithreaded"],
    image: "gradient",
    link: "https://www.youtube.com/watch?v=vuv7Zqasxaw",
    github: "https://github.com/manavbansal1/Team-Box-Conquest.git",
    Readme: "#",
    animation: "glitch",
    bgGradient: "from-orange-950 via-red-900 to-black",
    accentColor: "from-orange-500 via-red-600 to-pink-700",
  },
  {
    id: 5,
    title: "Unix Shell Clone",
    subtitle: "A custom Unix shell implemented in C",
    description: "This project is a custom Unix shell implemented in C that mimics the behavior of standard Unix shells. It supports features like command execution, piping, redirection, and built-in commands, providing a hands-on understanding of shell internals and process management.",
    tags: ["C", "Pipelines","Signals","Process Management"],
    image: "gradient",
    link: "#",
    github: "https://www.candyragi.info/Pnf",
    Readme: "#",
    animation: "flipPulse",
    bgGradient: "from-indigo-950 via-purple-900 to-black",
    accentColor: "from-indigo-400 via-purple-500 to-pink-600",
  },
];

// --------------- INTERACTIVE OBJECTS ---------------
interface InteractiveObjectProps {
  type: "cube" | "sphere" | "pyramid";
  x: string;
  y: string;
}

const InteractiveObject = ({ type, x, y }: InteractiveObjectProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const objects: Record<string, ReactNode> = {
    cube: (
      <motion.div
        animate={{
          rotateX: isHovered ? 180 : 0,
          rotateY: isHovered ? 180 : 0,
        }}
        transition={{ duration: 0.6 }}
        style={{ perspective: 1000 }}
        className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    ),
    sphere: (
      <motion.div
        animate={{ scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50"
      />
    ),
    pyramid: (
      <motion.div
        animate={{ rotateZ: isHovered ? 360 : 0 }}
        transition={{ duration: 0.6 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-500"
        style={{
          borderLeftWidth: "20px",
          borderRightWidth: "20px",
          borderBottomWidth: "35px",
        }}
      />
    ),
  };

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
      {objects[type]}
    </motion.div>
  );
};

// ------------------ MAIN PAGE -------------------
export default function ProjectsPage() {
  const [currentProject, setCurrentProject] = useState<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // scroll down → next project (wrap around)
        setCurrentProject((prev) => (prev + 1) % projectsData.length);
      } else if (e.deltaY < 0) {
        // scroll up → previous project (wrap around)
        setCurrentProject(
          (prev) =>
            (prev - 1 + projectsData.length) % projectsData.length // ensure positive modulo
        );
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const project = projectsData[currentProject];

  return (
    <div className="relative w-full h-screen overflow-x-hidden">
      <ValorantNavbar />

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient}`}
        >
          {/* Background accent blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
            className={`absolute inset-0 bg-gradient-to-r ${project.accentColor} blur-[180px] -z-10`}
          />

          {/* Floating objects */}
          <InteractiveObject type="cube" x="10%" y="15%" />
          <InteractiveObject type="sphere" x="85%" y="20%" />
          <InteractiveObject type="pyramid" x="50%" y="75%" />

          {/* Project content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-6 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center max-w-4xl"
            >
              <p className="text-sm md:text-base uppercase tracking-widest text-gray-400 mb-4 font-['Valorant']">
                {`0${currentProject + 1}`}
              </p>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 font-['Valorant'] text-white">
                {project.title}
              </h1>
              <p className="text-lg md:text-2xl text-gray-300 mb-6 font-['Valorant']">
                {project.subtitle}
              </p>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 border border-white/20 rounded-full text-sm text-white/70 hover:bg-white/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-center gap-6 mb-16">
                <a
                  href={project.link}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  View Project
                  <ExternalLink size={18} />
                </a>
                <a
                  href={project.github}
                  className="flex items-center gap-2 px-8 py-3 border-2 border-white/50 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  Github
                  <Github size={18} />
                </a>
                <a
                  href={project.Readme}
                  className="flex items-center gap-2 px-8 py-3 border-2 border-white/50 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                >
                  Readme
                  <BookOpen size={18} />
                </a>
              </div>
            </motion.div>

            {/* Dots navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
              {projectsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentProject(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentProject ? "bg-white w-8" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-20 text-white/50 text-sm"
            >
              <ChevronDown size={24} />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
