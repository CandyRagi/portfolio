"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ValorantNavbar from "@/Components/Navbar";
import { db } from "@/database/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { Search, X, ArrowRight, Tag, Plus, Code, Users, User, Globe, Link as LinkIcon } from "lucide-react";

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
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
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
  const [isLoaded, setIsLoaded] = useState(false);

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

  useEffect(() => {
    if (!isLoadingLinks) {
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoadingLinks]);

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
      if (e.key === "/" && !selectedLink && !uploadModalOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
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
                placeholder="Search links... (Press /)"
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

          {/* Tag Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${activeTag === tag
                  ? "bg-white text-black border-white font-bold"
                  : "bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
                  }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Links Grid */}
        {isLoadingLinks ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-2 border-t-red-500 border-white/10 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <motion.div
                    layout
                    key={link.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => window.open(link.websiteUrl, '_blank')}
                    className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-colors duration-300 flex flex-col h-full cursor-pointer"
                  >
                    {/* Card Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Image Section */}
                    {link.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={link.imageUrl}
                          alt={link.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />

                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white flex items-center gap-1">
                            {link.projectType === 'Group Project' && <Users size={12} />}
                            {link.projectType === 'Solo Project' && <User size={12} />}
                            {link.projectType === 'Assignment' && <Tag size={12} />}
                            {link.projectType}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="relative p-6 flex flex-col flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {link.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {link.tags.length > 3 && (
                          <span className="text-[10px] text-gray-500 px-2 py-1">+ {link.tags.length - 3}</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-500 transition-colors line-clamp-1">
                        {link.title}
                      </h3>

                      <p className="text-sm text-gray-400 mb-4 font-sans leading-relaxed line-clamp-2 flex-grow">
                        {link.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                          <Code size={12} />
                          <span className="truncate max-w-[150px]">{link.languages.join(', ')}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                          VISIT <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No links found matching your search.
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] p-4 flex items-center justify-center"
            onClick={() => setUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Link</h2>
                <button onClick={() => setUploadModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder="Website URL *"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                />

                <textarea
                  placeholder="Description *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors h-24 resize-none font-sans"
                />

                <input
                  type="text"
                  placeholder="Languages (comma-separated)"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                />

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-400">Project Type</label>
                  <div className="flex flex-wrap gap-3">
                    {projectTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setFormData(prev => ({ ...prev, projectType: type }))}
                        className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${formData.projectType === type ? "bg-red-600 text-white" : "bg-black/50 border border-white/10 text-gray-300 hover:border-white/30"}`}
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
                        className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${formData.tags.includes(tag) ? "bg-red-600 text-white" : "bg-black/50 border border-white/10 text-gray-300 hover:border-white/30"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
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
                  onClick={() => { setPasswordModalOpen(false); setPasswordInput(""); setPasswordError(""); }}
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