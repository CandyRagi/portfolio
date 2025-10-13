"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ValorantNavbar from "@/Components/Navbar";
import { db } from "@/database/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Search, X, ArrowRight, Clock, User, Tag } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category?: string;
  readTime?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const FloatingParticle: React.FC<{ delay: number; id: number }> = ({ delay, id }) => {
  const x = Math.sin(id * 12.9898) * 43758.5453;
  const y = Math.sin(id * 78.233) * 43758.5453;
  const xPos = ((x - Math.floor(x)) * 100).toFixed(1);
  const yPos = ((y - Math.floor(y)) * 100).toFixed(1);

  return (
    <motion.div
      className="absolute w-1 h-1 bg-red-500/30 rounded-full blur-sm"
      style={{ left: `${xPos}%`, top: `${yPos}%` }}
      animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity }}
    />
  );
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data() as Partial<Blog>;
        return {
          id: doc.id,
          title: d.title ?? "Untitled",
          subtitle: d.subtitle ?? "",
          content: d.content ?? "",
          author: d.author ?? "Unknown",
          date: d.date ?? new Date().toISOString(),
          image: d.image,
          category: d.category,
          readTime: d.readTime ?? 3,
        };
      });
      setBlogs(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !selectedBlog) searchInputRef.current?.focus();
      if (e.key === "Escape") setSelectedBlog(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlog]);

  // ✅ Strictly typed categories
  const categories: string[] = [
    "all",
    ...new Set(
      blogs
        .map((b) => b.category)
        .filter((c): c is string => Boolean(c))
    ),
  ];

  const filteredBlogs = blogs.filter((b) => {
    const term = search.toLowerCase();
    const matchSearch =
      b.title.toLowerCase().includes(term) ||
      b.subtitle.toLowerCase().includes(term) ||
      b.author.toLowerCase().includes(term);
    const matchCategory = activeCategory === "all" || b.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0005] text-white font-['Valorant'] overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-purple-800 blur-[180px] -z-10"
      />

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} id={i} delay={i * 0.15} />
        ))}
      </div>

      <ValorantNavbar />

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl mx-auto px-6 mb-12 relative pt-36"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-2xl shadow-red-900/10 transition hover:border-red-500/50">
            <Search size={20} className="text-red-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search blogs... (Press / to focus)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-white placeholder-gray-500 font-['Valorant'] text-lg"
            />
            {search && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center gap-3 px-6 mb-16 flex-wrap"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full font-medium transition-all capitalize ${
              activeCategory === cat
                ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                : "bg-white/5 text-gray-300 border border-white/10 hover:border-red-500/50"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Blog Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="flex flex-wrap justify-center gap-8 px-6 md:px-16 pb-32"
      >
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={cardVariants}
              className="group relative w-[300px] cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-300 blur -z-10" />
              <div className="relative rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-red-500/60 transition-all overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-900/30 h-full">
                {blog.image && (
                  <div className="relative h-36 overflow-hidden">
                    <motion.img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                    {blog.category && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                        <Tag size={12} />
                        {blog.category}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4 flex flex-col h-full">
                  <h2 className="text-base font-bold mb-1 text-white group-hover:text-red-400 transition line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-1">{blog.subtitle}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2 mt-auto">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {blog.readTime} min
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{blog.date}</p>
                  <div className="flex justify-end pt-3 border-t border-white/10">
                    <ArrowRight size={14} className="text-red-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-lg text-center w-full py-20">
            No blogs found. Try adjusting your search.
          </p>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white p-8 rounded-3xl border border-red-700/30 shadow-2xl shadow-red-900/50 overflow-y-auto max-h-[85vh]"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition z-10"
              >
                <X size={24} />
              </motion.button>

              {selectedBlog.image && (
                <motion.img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="rounded-2xl mb-8 w-full max-h-96 object-cover shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                />
              )}

              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                {selectedBlog.title}
              </h2>
              <p className="text-gray-400 text-lg italic mb-6">{selectedBlog.subtitle}</p>
              <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-white/10 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-red-500" />
                  {selectedBlog.author}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-red-500" />
                  {selectedBlog.readTime} min read
                </div>
                <div>{selectedBlog.date}</div>
                {selectedBlog.category && (
                  <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full">
                    <Tag size={14} />
                    {selectedBlog.category}
                  </div>
                )}
              </div>

              <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {selectedBlog.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm font-['Valorant']">
        © 2025 ANSH TIWARI
      </footer>
    </div>
  );
}
