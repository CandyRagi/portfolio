"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ValorantNavbar from "@/Components/Navbar";
import { db } from "@/database/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { Search, X, ArrowRight, Clock, User, Tag, Plus } from "lucide-react";

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
    transition: { staggerChildren: 0.02, delayChildren: 0 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3 },
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
  const PASSWORD = "Candy6001";

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
      if (e.key === "/" && !selectedBlog && !uploadModalOpen && !summaryBlog) searchInputRef.current?.focus();
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

  const handleVerifyPassword = () => {
    if (passwordInput === PASSWORD) {
      setPasswordModalOpen(false);
      setPasswordInput("");
      setPasswordError("");
      handleSubmitBlog();
    } else {
      setPasswordError("Good try noob");
      setPasswordInput("");
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0005] text-white font-['Valorant'] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-purple-800 blur-[180px] -z-10"
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} id={i} delay={i * 0.15} />
        ))}
      </div>

      <ValorantNavbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="max-w-4xl mx-auto px-6 mb-12 relative pt-36"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-2xl shadow-red-900/10 transition hover:border-red-500/50">
            <Search size={20} className="text-red-400 flex-shrink-0" />
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
                className="text-gray-400 hover:text-white flex-shrink-0"
              >
                <X size={18} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadClick}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition text-sm font-semibold flex-shrink-0"
            >
              
              + Upload Blog
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex justify-center gap-3 px-6 mb-16 flex-wrap"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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

      {isLoadingBlogs ? (
        <div className="flex justify-center items-center min-h-[400px] w-full">
          <div className="w-12 h-12 border-3 border-t-red-600 border-white/20 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          key={`${search}-${activeCategory}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-8 px-6 md:px-16 pb-32 min-h-[400px]"
        >
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                variants={cardVariants}
                layout
                className="group relative w-[300px] h-[320px] cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-300 blur -z-10" />
                <div className="relative rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-red-500/60 transition-all overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-900/30 h-full flex flex-col">
                  {blog.image ? (
                    <div className="relative h-32 overflow-hidden flex-shrink-0">
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
                  ) : null}
                  <div className="p-4 flex flex-col flex-grow">
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
                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSummarizeClick(blog);
                        }}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full text-xs font-semibold transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="white"/>
                          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79-4-4-4z" fill="white"/>
                        </svg>
                        Summarize
                      </motion.button>
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
      )}

      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
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
                  transition={{ delay: 0.1 }}
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

      <AnimatePresence>
        {summaryBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4"
            onClick={() => {
              setSummaryBlog(null);
              setSummary(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white p-8 rounded-3xl border border-purple-700/30 shadow-2xl shadow-purple-900/50 overflow-y-auto max-h-[85vh]"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSummaryBlog(null);
                  setSummary(null);
                }}
                className="absolute top-6 right-6 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition z-10"
              >
                <X size={24} />
              </motion.button>

              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Summary of "{summaryBlog.title}"
              </h2>

              {isLoadingSummary ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <motion.div
                    className="w-12 h-12 border-3 border-t-purple-600 border-white/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-gray-400 mt-4">Generating summary...</p>
                </div>
              ) : (
                <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {summary || "No summary available."}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4"
            onClick={() => setUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white p-8 rounded-3xl border border-red-700/30 shadow-2xl shadow-red-900/50 overflow-y-auto max-h-[85vh]"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition z-10"
              >
                <X size={24} />
              </motion.button>

              <h2 className="text-3xl font-bold mb-6 text-white">Upload Blog</h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Blog Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder="Subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder="Author Name *"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
                />

                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
                >
                  {blogCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Read Time (minutes)"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
                />

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste a direct image URL or use an image hosting service like imgur.com
                  </p>
                </div>

                <textarea
                  placeholder="Blog Content *"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  maxLength={5000}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors h-40 resize-none"
                />
                <p className="text-xs text-gray-400">
                  {formData.content.length}/5000 characters
                </p>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setUploadModalOpen(false);
                      setError(null);
                    }}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBlogClick}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                  >
                    {isSubmitting ? "Uploading..." : "Add Blog"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {passwordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
            onClick={() => {
              setPasswordModalOpen(false);
              setPasswordInput("");
              setPasswordError("");
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white p-8 rounded-3xl border border-red-700/30 shadow-2xl shadow-red-900/50"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Enter Password</h2>

              {passwordError && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm text-center font-semibold">
                  {passwordError}
                </div>
              )}

              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVerifyPassword()}
                autoFocus
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors mb-4"
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setPasswordInput("");
                    setPasswordError("");
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPassword}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 py-4 text-center text-gray-500 text-sm font-['Valorant']">
        © 2025 ANSH TIWARI
      </footer>
    </div>
  );
}