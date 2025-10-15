"use client";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ValorantNavbar from "@/Components/Navbar";
import { db } from "@/database/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Search, X,Plus, Clock, User, Tag } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  project: string;
  message: string;
  timestamp: Timestamp | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("Anonymous");
  const [project, setProject] = useState("fam app");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const projects = [
    "fam app",
    "uniman",
    "territory control games",
    "rizzervit",
    "unix shell",
    "other",
  ];

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsArray: Comment[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Anonymous",
            project: data.project || "other",
            message: data.message || "",
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp : null,
          } as Comment;
        });
        setComments(commentsArray);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments. Please try again later.");
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !modalOpen) searchInputRef.current?.focus();
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const handleAddComment = async () => {
    if (!message.trim()) {
      setError("Comment message cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        name: name.trim() || "Anonymous",
        project,
        message: message.trim(),
        timestamp: serverTimestamp(),
      });

      setModalOpen(false);
      setName("Anonymous");
      setProject("fam app");
      setMessage("");
      setError(null);
      window.location.reload();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDateString = useCallback((timestamp: Timestamp | null): string => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return "Unknown date";
    }
  }, []);

  const filteredComments = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return comments.filter((comment) => {
      const messageMatch =
        comment.message.toLowerCase().includes(search) ||
        comment.name.toLowerCase().includes(search);
      const projectMatch = !projectFilter || comment.project === projectFilter;
      return messageMatch && projectMatch;
    });
  }, [comments, searchTerm, projectFilter]);

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

      <div className="container mx-auto px-4 py-8 relative z-10 pt-36">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300" />
            <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full shadow-2xl shadow-red-900/10 transition hover:border-red-500/50">
              <Search size={20} className="text-red-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search comments... (Press / to focus)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-white placeholder-gray-500 font-['Valorant'] text-lg"
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-white flex-shrink-0"
                >
                  <X size={18} />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition text-sm font-semibold flex-shrink-0"
              >
                + Add Comment
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center gap-3 mb-16 flex-wrap"
        >
          {["all", ...projects].map((proj) => (
            <motion.button
              key={proj}
              onClick={() => setProjectFilter(proj === "all" ? "" : proj)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2 rounded-full font-medium transition-all capitalize ${
                projectFilter === (proj === "all" ? "" : proj)
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:border-red-500/50"
              }`}
            >
              {proj}
            </motion.button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px] w-full">
            <div className="w-12 h-12 border-3 border-t-red-600 border-white/20 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex justify-items-center">
  <motion.div
    key={`${searchTerm}-${projectFilter}`}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max min-h-[300px] "
  >
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  variants={itemVariants}
                  layout
                  className="relative bg-[#1a1a1a] p-4 rounded-lg border border-gray-700 hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur -z-10" />
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="flex items-center gap-1 bg-red-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold capitalize flex-shrink-0">
                      <Tag size={12} />
                      {comment.project}
                    </span>
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      {getDateString(comment.timestamp)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2 text-white group-hover:text-red-400 transition truncate">
                    {comment.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed break-words line-clamp-3">
                    {comment.message}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-20">
                <p className="text-gray-400 text-lg">
                  {comments.length === 0
                    ? "No comments yet. Be the first!"
                    : "No comments match your filters."}
                </p>
              </div>
            )}
          </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white p-6 rounded-3xl border border-red-700/30 shadow-2xl shadow-red-900/50"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              >
                <X size={20} />
              </motion.button>

              <h2 className="text-2xl font-bold mb-4 text-white">Add Comment</h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Name (or Anonymous)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 text-white p-3 mb-4 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
              />

              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-gray-800 text-white p-3 mb-4 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
              >
                {projects.map((proj) => (
                  <option key={proj} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Your comment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                className="w-full bg-gray-800 text-white p-3 mb-2 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors h-32 resize-none"
              />
              <p className="text-xs text-gray-400 mb-4">
                {message.length}/500 characters
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setError(null);
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  {isSubmitting ? "Posting..." : "Post"}
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