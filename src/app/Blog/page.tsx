"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ValorantNavbar from "@/Components/Navbar";
import { db } from "@/database/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { Search, X, ArrowRight, Clock, User, Tag, Plus, Sparkles } from "lucide-react";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [summaryBlog, setSummaryBlog] = useState<Blog | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    author: "",
    category: "IRL",
    readTime: "3",
    image: "",
  });

  const blogCategories = ["IRL", "Projects", "Anime", "Kdrama", "Web series", "Games", "others"];
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate filteredBlogs FIRST before using it in useEffect
  const filteredBlogs = useMemo(() => {
    const term = search.toLowerCase();
    return blogs.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(term) ||
        b.subtitle.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term);
      const matchCategory = activeCategory === "all" || b.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [blogs, search, activeCategory]);

  useEffect(() => {
    if (!isLoadingBlogs) {
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoadingBlogs]);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
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
        setIsLoadingBlogs(false);
      },
      (error) => {
        console.error("Error fetching blogs:", error);
        setIsLoadingBlogs(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !selectedBlog && !uploadModalOpen && !summaryBlog) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSelectedBlog(null);
        setSummaryBlog(null);
        setSummary(null);
        setUploadModalOpen(false);
        setPasswordModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlog, uploadModalOpen, passwordModalOpen, summaryBlog]);

  const categories: string[] = ["all", ...blogCategories];

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleVerifyPassword = async () => {
    try {
      const passwordDocRef = doc(db, "secrets", "blog_password");
      const passwordDoc = await getDoc(passwordDocRef);

      if (passwordDoc.exists()) {
        const correctPassword = passwordDoc.data().value;
        if (passwordInput === correctPassword) {
          setPasswordModalOpen(false);
          setPasswordInput("");
          setPasswordError("");
          handleSubmitBlog();
        } else {
          setPasswordError("Good try noob");
          setPasswordInput("");
        }
      } else {
        setPasswordError("Password configuration error. Please contact admin.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setPasswordError("An error occurred during verification.");
    }
  };

  const handleSubmitBlog = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title: formData.title,
        subtitle: formData.subtitle,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        readTime: parseInt(formData.readTime) || 3,
        image: formData.image,
        date: new Date().toLocaleDateString("en-US"),
        timestamp: serverTimestamp(),
      });

      setUploadModalOpen(false);
      setFormData({
        title: "",
        subtitle: "",
        content: "",
        author: "",
        category: "IRL",
        readTime: "3",
        image: "",
      });
      setError(null);
      window.location.reload();
    } catch (err) {
      console.error("Error adding blog:", err);
      setError("Failed to upload blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBlogClick = () => {
    setPasswordModalOpen(true);
  };

  const handleSummarizeClick = async (blog: Blog) => {
    setSummaryBlog(blog);
    setIsLoadingSummary(true);
    setSummary(null);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: blog.content,
          title: blog.title,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      console.error("Summary generation error:", err);
      setSummary("Failed to generate summary. Please check your API key and try again.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Valorant'] selection:bg-red-500/30">
      <ValorantNavbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 space-y-8">

          {/* Search & Upload Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-lg transition-all hover:border-white/20">
              <Search size={20} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search blogs... (Press /)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500 font-sans text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400 transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                UPLOAD
              </button>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] as const }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: -10 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 + 0.2 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${activeCategory === cat
                  ? "bg-white text-black border-white font-bold"
                  : "bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
                  }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Blog Grid */}
        {isLoadingBlogs ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-2 border-t-red-500 border-white/10 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogs.map((blog, index) => {
              const term = search.toLowerCase();
              const matchSearch =
                blog.title.toLowerCase().includes(term) ||
                blog.subtitle.toLowerCase().includes(term) ||
                blog.author.toLowerCase().includes(term);
              const matchCategory = activeCategory === "all" || blog.category === activeCategory;
              const visible = matchSearch && matchCategory;

              return (
                <motion.div
                  layout
                  key={blog.id}
                  initial={false}
                  animate={{
                    opacity: isLoaded && visible ? 1 : 0,
                    scale: isLoaded && visible ? 1 : 0.8,
                    filter: isLoaded && visible ? "blur(0px)" : "blur(4px)",
                    y: isLoaded ? 0 : 30,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                    layout: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
                  }}
                  style={{
                    display: visible ? "flex" : "none",
                  }}
                  onClick={() => setSelectedBlog(blog)}
                  className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors duration-300 flex flex-col h-full cursor-pointer"
                >
                  {/* Card Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Image Section */}
                  {blog.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
                      {blog.category && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white">
                          {blog.category}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime} min</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-500 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4 font-sans leading-relaxed line-clamp-2 flex-grow">
                      {blog.subtitle || blog.content}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <span className="text-xs text-gray-500 font-sans">{blog.date}</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSummarizeClick(blog);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Sparkles size={12} />
                        Summarize
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] overflow-y-auto px-4 py-8"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {selectedBlog.image && (
                <div className="relative h-64 sm:h-96">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {selectedBlog.category && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                          {selectedBlog.category}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Clock size={12} /> {selectedBlog.readTime} min read
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{selectedBlog.title}</h1>
                    <p className="text-lg text-gray-300 font-sans">{selectedBlog.subtitle}</p>
                  </div>
                </div>
              )}

              <div className="p-8 sm:p-12">
                {!selectedBlog.image && (
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {selectedBlog.category && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                          {selectedBlog.category}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Clock size={12} /> {selectedBlog.readTime} min read
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{selectedBlog.title}</h1>
                    <p className="text-xl text-gray-400 font-sans">{selectedBlog.subtitle}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-8 text-sm text-gray-500 font-sans">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedBlog.author[0]}
                    </div>
                    <span>{selectedBlog.author}</span>
                  </div>
                  <span>{selectedBlog.date}</span>
                </div>

                <div className="prose prose-invert max-w-none font-sans text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Modal */}
      <AnimatePresence>
        {summaryBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] p-4 flex items-center justify-center"
            onClick={() => {
              setSummaryBlog(null);
              setSummary(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-zinc-900 border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-900/20"
            >
              <button
                onClick={() => {
                  setSummaryBlog(null);
                  setSummary(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Sparkles className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Summary</h3>
                  <p className="text-sm text-gray-400">{summaryBlog.title}</p>
                </div>
              </div>

              {isLoadingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-purple-400 animate-pulse">Generating insights...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none font-sans text-gray-300">
                  {summary || "No summary available."}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] p-4 flex items-center justify-center"
            onClick={() => setUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Blog</h2>
                <button onClick={() => setUploadModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                  >
                    {blogCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Read Time (min)"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                />

                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full h-40 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBlogClick}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {passwordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1001] p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Admin Access</h3>
              {passwordError && (
                <p className="text-red-400 text-sm mb-4">{passwordError}</p>
              )}
              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors mb-6"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setPasswordInput("");
                    setPasswordError("");
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPassword}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}