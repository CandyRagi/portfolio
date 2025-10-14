"use client";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
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

interface Comment {
  id: string;
  name: string;
  project: string;
  message: string;
  timestamp: Timestamp | null;
}

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

  const projects = [
    "fam app",
    "uniman",
    "territory control games",
    "rizzervit",
    "unix shell",
    "other",
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  // Fetch comments from Firestore
  useEffect(() => {
    setIsLoading(true);
    try {
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
    } catch (err) {
      console.error("Firestore error:", err);
      setError("Error connecting to database.");
      setIsLoading(false);
    }
  }, []);

  // Add new comment
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
      
      // Refresh the page after adding comment
      window.location.reload();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timestamp
  const getDateString = (timestamp: Timestamp | null): string => {
    if (!timestamp) return "Unknown date";

    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error converting timestamp:", err);
      return "Unknown date";
    }
  };

  // Search + filter logic
  const filteredComments = comments.filter((comment) => {
    const search = searchTerm.toLowerCase();
    const messageMatch =
      comment.message.toLowerCase().includes(search) ||
      comment.name.toLowerCase().includes(search);
    const projectMatch = !projectFilter || comment.project === projectFilter;
    return messageMatch && projectMatch;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0005] text-white overflow-hidden font-['Valorant'] pt-16 md:pt-20 pb-20">
      {/* Animated gradient light overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 bg-gradient-to-r from-red-700 via-pink-600 to-purple-800 blur-[180px] -z-10 pointer-events-none"
      />

      {/* NAVBAR */}
      <ValorantNavbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 bg-[#1a1a1a] text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
          />
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full md:w-1/4 bg-[#1a1a1a] text-white p-3 rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-colors"
          >
            <option value="">All Projects</option>
            {projects.map((proj) => (
              <option key={proj} value={proj}>
                {proj}
              </option>
            ))}
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="w-full md:w-auto bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Add Comment
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-red-500 border-b-2 border-l-transparent"></div>
          </div>
        )}

        {/* Comments Display */}
        {!isLoading && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max min-h-[200px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${searchTerm}-${projectFilter}`}
          >
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  variants={itemVariants}
                  layout
                  className="bg-[#1a1a1a] p-4 rounded-lg shadow-md border border-gray-700 hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-red-500 font-bold capitalize text-xs bg-red-500/10 px-2 py-1 rounded flex-shrink-0">
                      {comment.project}
                    </span>
                    <span className="text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
                      {getDateString(comment.timestamp)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2 text-white truncate">
                    {comment.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed break-words">
                    {comment.message}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg">
                  {comments.length === 0
                    ? "No comments yet. Be the first!"
                    : "No comments match your filters."}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal for adding comment */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md border border-red-500"
          >
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
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-600 transition-colors"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm font-['Valorant']">
        © 2025 ANSH TIWARI
      </footer>
    </div>
  );
}