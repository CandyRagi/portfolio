"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ValorantNavbar from "@/Components/Navbar";
import { db } from "@/database/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { Search, X, ArrowRight, Tag, Plus, Code, Users, User, Globe } from "lucide-react";

interface Link {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  projectType: "Group Project" | "Solo Project" | "Assignment";
  tags: ("AI/ML" | "Education" | "Vibe Coding" | "Game" | "RealWorld" | "Embedded systems")[];
  languages: string[];
  date: string;
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
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: { duration: 0.2 },
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

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [activeTag, setActiveTag] = useState<string>("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    websiteUrl: "",
    projectType: "Solo Project" as Link['projectType'],
    tags: [] as Link['tags'],
    languages: "",
  });

  const projectTypes: Link['projectType'][] = ["Group Project", "Solo Project", "Assignment"];
  const availableTags: Link['tags'][0][] = ["AI/ML", "Education", "Vibe Coding", "Game", "RealWorld", "Embedded systems"];
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredLinks = useMemo(() => {
    const term = search.toLowerCase();
    return links.filter((l) => {
      const matchSearch =
        l.title.toLowerCase().includes(term) ||
        (l.description && l.description.toLowerCase().includes(term)) ||
        l.languages.join(" ").toLowerCase().includes(term);
      const matchTag = activeTag === "all" || l.tags.includes(activeTag as Link['tags'][number]);
      return matchSearch && matchTag;
    });
  }, [links, search, activeTag]);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const cardId = entry.target.getAttribute('data-card-id');
      if (cardId) {
        setVisibleCards((prev) => {
          const newSet = new Set(prev);
          if (entry.isIntersecting) {
            newSet.add(cardId);
          } else {
            newSet.delete(cardId);
          }
          return newSet;
        });
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    const cards = document.querySelectorAll('[data-card-id]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredLinks, observerCallback]);

  useEffect(() => {
    const q = query(collection(db, "links"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const d = doc.data() as Partial<Link>;
          return {
            id: doc.id,
            title: d.title ?? "Untitled",
            description: d.description ?? "",
            imageUrl: d.imageUrl ?? "",
            websiteUrl: d.websiteUrl ?? "",
            projectType: d.projectType ?? "Solo Project",
            tags: d.tags ?? [],
            languages: d.languages ?? [],
            date: d.date ?? new Date().toISOString(),
          };
        });
        setLinks(data);
        setIsLoadingLinks(false);
      },
      (error) => {
        console.error("Error fetching links:", error);
        setIsLoadingLinks(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !selectedLink && !uploadModalOpen) searchInputRef.current?.focus();
      if (e.key === "Escape") {
        setSelectedLink(null);
        setUploadModalOpen(false);
        setPasswordModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLink, uploadModalOpen, passwordModalOpen]);

  const tags: string[] = ["all", ...availableTags];

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleVerifyPassword = async () => {
    try {
      const passwordDocRef = doc(db, "secrets", "links_password");
      const passwordDoc = await getDoc(passwordDocRef);

      if (passwordDoc.exists()) {
        const correctPassword = passwordDoc.data().value;
        if (passwordInput === correctPassword) {
          setPasswordModalOpen(false);
          setPasswordInput("");
          setPasswordError("");
          handleSubmitLink();
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

  const handleSubmitLink = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.websiteUrl.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "links"), {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        websiteUrl: formData.websiteUrl,
        projectType: formData.projectType,
        tags: formData.tags,
        languages: formData.languages.split(',').map(l => l.trim()),
        date: new Date().toLocaleDateString("en-US"),
        timestamp: serverTimestamp(),
      });

      setUploadModalOpen(false);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        websiteUrl: "",
        projectType: "Solo Project",
        tags: [],
        languages: "",
      });
      setError(null);
    } catch (err) {
      console.error("Error adding link:", err);
      setError("Failed to upload link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLinkClick = () => {
    setPasswordModalOpen(true);
  };

  const handleTagToggle = (tag: Link['tags'][0]) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

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
              placeholder="Search links... (Press / to focus)"
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
              <Plus size={16} />
              Upload Link
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
        {tags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => setActiveTag(tag)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-5 py-2 rounded-full font-medium transition-all capitalize ${
              activeTag === tag
                ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                : "bg-white/5 text-gray-300 border border-white/10 hover:border-red-500/50"
            }`}
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>

      {isLoadingLinks ? (
        <div className="flex justify-center items-center min-h-[400px] w-full">
          <div className="w-12 h-12 border-3 border-t-red-600 border-white/20 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          key={`${search}-${activeTag}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-8 px-6 md:px-16 pb-32 min-h-[400px]"
        >
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <motion.div
                key={link.id}
                data-card-id={link.id}
                variants={cardVariants}
                initial="hidden"
                animate={visibleCards.has(link.id) ? "visible" : "hidden"}
                exit="exit"
                layout
                className="group relative w-full max-w-[90vw] md:max-w-[55vw] cursor-pointer"
                onClick={() => window.open(link.websiteUrl, '_blank')}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-300 blur -z-10" />
                <div className="relative rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-red-500/60 transition-all overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-900/30 h-full flex flex-col md:flex-row items-stretch">
                  {link.imageUrl && (
                    <div className="relative w-full md:w-1/4 overflow-hidden flex-shrink-0">
                      <motion.img
                        src={link.imageUrl}
                        alt={link.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="p-3 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-red-400 group-hover:text-red-300 transition line-clamp-1">
                        {link.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs bg-red-600/80 backdrop-blur-md px-3 py-1 rounded-full font-bold flex-shrink-0 ml-4">
                        {link.projectType === 'Group Project' && <Users size={12} />}
                        {link.projectType === 'Solo Project' && <User size={12} />}
                        {link.projectType === 'Assignment' && <Tag size={12} />}
                        {link.projectType}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {link.tags.map(tag => (
                        <div key={tag} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full text-xs font-medium">
                          {tag}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2 line-clamp-3 overflow-hidden text-ellipsis">
                      {link.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mt-auto">
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-red-400"/>
                        {link.languages.join(', ')}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-3">
                      <span className="text-xs text-gray-500">{link.date}</span>
                      <div className="flex items-center gap-2 text-red-400">
                        Visit Site
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-lg text-center w-full py-20">
              No links found. Try adjusting your search.
            </p>
          )}
        </motion.div>
      )}

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
              className="relative w-full max-w-3xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white p-8 rounded-3xl border border-red-700/30 shadow-2xl shadow-red-900/50 overflow-y-auto max-h-[90vh]"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition z-10"
              >
                <X size={24} />
              </motion.button>

              <h2 className="text-3xl font-bold mb-6 text-white">Upload Link</h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <input 
                  type="text" 
                  placeholder="Title *" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors" 
                />

                <input 
                  type="text" 
                  placeholder="Website URL *" 
                  value={formData.websiteUrl} 
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })} 
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors" 
                />

                <input 
                  type="text" 
                  placeholder="Image URL" 
                  value={formData.imageUrl} 
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors" 
                />

                <textarea 
                  placeholder="Description *" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors h-24 resize-none" 
                />

                <input 
                  type="text" 
                  placeholder="Languages (comma-separated)" 
                  value={formData.languages} 
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })} 
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors" 
                />

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">Project Type</label>
                  <div className="flex flex-wrap gap-3">
                    {projectTypes.map(type => (
                      <button 
                        key={type} 
                        onClick={() => setFormData(prev => ({...prev, projectType: type}))} 
                        className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${formData.projectType === type ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">Tags</label>
                  <div className="flex flex-wrap gap-3">
                    {availableTags.map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => handleTagToggle(tag)} 
                        className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${formData.tags.includes(tag) ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    onClick={() => setUploadModalOpen(false)} 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddLinkClick} 
                    disabled={isSubmitting} 
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                  >
                    {isSubmitting ? "Uploading..." : "Add Link"}
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
            onClick={() => { setPasswordModalOpen(false); setPasswordInput(""); setPasswordError(""); }}
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
                  onClick={() => { setPasswordModalOpen(false); setPasswordInput(""); setPasswordError(""); }} 
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

      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm font-['Valorant']">
        © 2025 ANSH TIWARI
      </footer>
    </div>
  );
}