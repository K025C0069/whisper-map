import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface MessageComposerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export function MessageComposer({ open, onClose, onSubmit }: MessageComposerProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-end justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/60" />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-strong relative w-full max-w-sm rounded-2xl p-6 mb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />

            <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
              この場所にメッセージを残す
            </h3>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ひとこと..."
              maxLength={100}
              rows={3}
              className="w-full resize-none rounded-xl bg-muted p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              autoFocus
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {text.length}/100
              </span>
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                残す
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
