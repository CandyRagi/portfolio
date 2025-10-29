"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";
import { BookOpen, ChevronDown, ExternalLink, Github } from "lucide-react";

// Placeholder - import your actual ValorantNavbar component
import Navbar from "@/Components/Navbar";
const ValorantNavbar = () => <Navbar />;

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
  category: string;
}

const projectsData: Project[] = [

  {
    id: 1,
    title: "Study Sage",
    subtitle: "From Notes to Mastery",
    description:
      "Study Sage is an intelligent study companion app that transforms your notes into mastery through AI-powered insights. Built with Kotlin for native Android performance, it features multiplayer study games powered by Ktor for real-time collaboration. The app leverages Gemini AI to generate smart summaries, quizzes, and study guides from your notes, with all data securely stored in Firebase for seamless cross-device synchronization.",
    tags: ["Kotlin", "NodeJS", "Firebase", "Ktor"],
    image: "gradient",
    link: "#",
    github: "https://github.com/manavbansal1/StudySage.git",
    Readme: "#",
    animation: "tiles",
    bgGradient: "from-slate-900 via-purple-900 to-black",
    accentColor: "from-cyan-500 via-blue-600 to-purple-700",
    category: "Mobile Application",
  },
  {
    id: 2,
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
    category: "Web Application",
  },
  {
    id: 5,
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
    category: "Mobile Application",
  },
  {
    id: 6,
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
    category: "Web Application",
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
    category: "Game",
  },
  {
    id: 3,
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
    category: "System Programming",
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
        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg"
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
        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50"
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
          borderLeftWidth: "15px",
          borderRightWidth: "15px",
          borderBottomWidth: "26px",
        }}
      />
    ),
  };

  return (
    <motion.div
      className="absolute hidden sm:block"
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(projectsData.map(p => p.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === "All" 
    ? projectsData 
    : projectsData.filter(p => p.category === selectedCategory);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Determine which direction had more movement
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal) {
      // Horizontal swipe
      if (isLeftSwipe) {
        // Swipe left → next project
        setCurrentProject((prev) => (prev + 1) % filteredProjects.length);
      } else if (isRightSwipe) {
        // Swipe right → previous project
        setCurrentProject(
          (prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length
        );
      }
    } else {
      // Vertical swipe
      if (isUpSwipe) {
        // Swipe up → next project
        setCurrentProject((prev) => (prev + 1) % filteredProjects.length);
      } else if (isDownSwipe) {
        // Swipe down → previous project
        setCurrentProject(
          (prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length
        );
      }
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // scroll down → next project (wrap around)
        setCurrentProject((prev) => (prev + 1) % filteredProjects.length);
      } else if (e.deltaY < 0) {
        // scroll up → previous project (wrap around)
        setCurrentProject(
          (prev) =>
            (prev - 1 + filteredProjects.length) % filteredProjects.length
        );
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [filteredProjects.length]);

  // Reset to first project when category changes
  useEffect(() => {
    setCurrentProject(0);
  }, [selectedCategory]);

  const project = filteredProjects[currentProject];

  if (filteredProjects.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-x-hidden bg-black">
        <ValorantNavbar />
        <div className="flex items-center justify-center h-full px-4">
          <p className="text-white text-lg sm:text-xl text-center">No projects found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-screen overflow-x-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <ValorantNavbar />

      {/* Category Dropdown - Top Right */}
      <div className="fixed top-4 right-4 sm:right-6 z-9999">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm sm:text-base font-medium hover:bg-white/20 transition-all flex items-center gap-2 min-w-[140px] sm:min-w-[180px] justify-between"
          >
            <span className="truncate">{selectedCategory}</span>
            <ChevronDown 
              size={18} 
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden min-w-[140px] sm:min-w-[180px]"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 sm:px-6 py-2 sm:py-3 text-left text-sm sm:text-base hover:bg-white/10 transition-colors ${
                      selectedCategory === category
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/70"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
            className={`absolute inset-0 bg-gradient-to-r ${project.accentColor} blur-[120px] sm:blur-[180px] -z-10`}
          />

          {/* Floating objects - hidden on mobile for better performance */}
          <InteractiveObject type="cube" x="10%" y="15%" />
          <InteractiveObject type="sphere" x="85%" y="20%" />
          <InteractiveObject type="pyramid" x="50%" y="75%" />

          {/* Project content */}
          <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-32 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center max-w-4xl w-full"
            >
              <p className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-gray-400 mb-3 sm:mb-4 font-['Valorant']">
                {`0${currentProject + 1}`}
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4 font-['Valorant'] text-white leading-tight">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-4 sm:mb-6 font-['Valorant'] px-2">
                {project.subtitle}
              </p>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
                {project.description}
              </p>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 border border-white/20 rounded-full text-xs sm:text-sm text-white/70 hover:bg-white/10 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-16 px-2">
                <a
                  href={project.link}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black rounded-full text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors"
                >
                  View Project
                  <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
                <a
                  href={project.github}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white/50 text-white rounded-full text-sm sm:text-base font-bold hover:bg-white/10 transition-colors"
                >
                  Github
                  <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
                <a
                  href={project.Readme}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white/50 text-white rounded-full text-sm sm:text-base font-bold hover:bg-white/10 transition-colors"
                >
                  Readme
                  <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" />
                </a>
              </div>
            </motion.div>

            {/* Dots navigation */}
            <div className="absolute bottom-16 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
              {filteredProjects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentProject(i)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    i === currentProject ? "bg-white w-6 sm:w-8" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-6 sm:bottom-20 text-white/50 text-sm"
            >
              <ChevronDown size={20} className="sm:w-[24px] sm:h-[24px]" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}