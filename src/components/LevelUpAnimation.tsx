import { motion } from "framer-motion";

export default function LevelUpAnimation({ level }: { level: number }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative flex flex-col items-center justify-center p-8"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 w-6 h-6 bg-pink-400 rounded-full animate-ping opacity-80" />
          <div className="absolute right-1/4 top-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-80" />
          <div className="absolute left-1/3 bottom-1/4 w-5 h-5 bg-cyan-400 rounded-full animate-ping opacity-80" />
        </div>

        <div className="text-6xl font-extrabold text-white drop-shadow-2xl tracking-wider">
          <motion.span
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-5xl text-yellow-300"
          >
            LEVEL UP!
          </motion.span>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-4xl font-bold text-white"
        >
          Lv. {level}
        </motion.div>
      </motion.div>
    </div>
  );
}
