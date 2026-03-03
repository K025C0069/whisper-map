import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "@/types/message";

interface MessageViewerProps {
  message: Message | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

export function MessageViewer({ message, onClose, onDelete }: MessageViewerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] flex items-end justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/60" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-strong relative w-full max-w-sm rounded-2xl p-6 mb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <p className="text-lg leading-relaxed text-foreground text-center">
              {message.text}
            </p>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {timeAgo(message.timestamp)}
            </p>

            {message.id.startsWith("msg-") && (
              <button
                onClick={() => {
                  onDelete(message.id);
                  onClose();
                }}
                className="mt-6 w-full rounded-xl bg-destructive/10 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
              >
                このメッセージを削除
              </button>
            )}

            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-secondary py-2.5 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              閉じる
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
