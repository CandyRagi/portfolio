"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BookOpen, ExternalLink, Github, Code2, Terminal, Gamepad2, Smartphone, Globe } from "lucide-react";
import Navbar from "@/Components/Navbar";

// Placeholder - import your actual ValorantNavbar component
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
      "Study Sage is an intelligent study companion app that transforms your notes into mastery through AI-powered insights. Built with Kotlin for native Android performance, it features multiplayer study games powered by Ktor for real-time collaboration. The app leverages Gemini AI to generate smart summaries, quizzes, and study guides from your notes.",
    tags: ["Kotlin", "NodeJS", "Firebase", "Ktor"],
    image: "gradient",
    link: "https://studysage.vercel.app/",
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
    subtitle: "Construction Material Management",
    description:
      "UniMan is a progressive web application designed to streamline the management of construction materials for stores and sites. It offers features such as inventory tracking, order management, and real-time updates, ensuring efficient material handling and reducing delays in construction projects.",
    tags: ["NextJS", "Firebase", "Express", "TypeScript", "TailwindCSS"],
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
    id: 7,
    title: "Tap The Huzz",
    subtitle: "NFC Sharing Android App",
    description: "Yo, welcome to TapTheHuzz. This ain't your grandma's contact sharing app. Imagine this: You see a baddie across the room. You walk up, drop the line: \"Are you mixed?? Cause you look half mine and half fine\". Then BOOM, you tap your phone on hers and slide into those DMs instantly. No typing, no fumbling, just pure RIZZ. ",
    tags: ["Kotlin", "HCE"],
    image: "gradient",
    link: "https://candyragi.github.io/TapTheHuzz/",
    github: "https://github.com/CandyRagi/TapTheHuzz",
    Readme: "https://github.com/CandyRagi/TapTheHuzz/blob/main/README.md",
    animation: "flipPulse",
    bgGradient: "from-indigo-950 via-purple-900 to-black",
    accentColor: "from-indigo-400 via-purple-500 to-pink-600",
    category: "Mobile Application",
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
    subtitle: "Movie Booking Platform",
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
    title: "Territory Control",
    subtitle: "2D Multiplayer Strategy Game",
    description: "A JavaFx Application that uses Sockets to create a 2D territory control game. Players can control territories, build structures, and compete against each other in real-time on local network.",
    tags: ["JavaFx", "TCP/IP", "MVC", "Multithreaded"],
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
    subtitle: "Custom C Implementation",
    description: "This project is a custom Unix shell implemented in C that mimics the behavior of standard Unix shells. It supports features like command execution, piping, redirection, and built-in commands.",
    tags: ["C", "Pipelines", "Signals", "Process Management"],
    image: "gradient",
    link: "#",
    github: "https://www.candyragi.info/Pnf",
    Readme: "#",
    animation: "flipPulse",
    bgGradient: "from-indigo-950 via-purple-900 to-black",
    accentColor: "from-indigo-400 via-purple-500 to-pink-600",
    category: "System Programming",
  }
  
];

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "Mobile Application": return <Smartphone size={18} />;
    case "Web Application": return <Globe size={18} />;
    case "Game": return <Gamepad2 size={18} />;
    case "System Programming": return <Terminal size={18} />;
    default: return <Code2 size={18} />;
  }
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(projectsData.map(p => p.category)))];

  // Filter projects by category
  const filteredProjects = selectedCategory === "All"
    ? projectsData
    : projectsData.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white font-['Valorant'] selection:bg-red-500/30">
      <ValorantNavbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header - Filters Only */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${selectedCategory === category
                    ? "bg-white text-black border-white font-bold"
                    : "bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors duration-300 flex flex-col h-full"
              >
                {/* Card Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                <div className="relative p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/5 rounded-lg text-red-400 group-hover:text-white transition-colors">
                      <CategoryIcon category={project.category} />
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View Code"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.link !== "#" && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-red-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 font-sans leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300 font-sans"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 text-gray-500 font-sans">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
  );
}