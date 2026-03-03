import { useLevel } from "../contexts/LevelContext";

export default function LevelDisplay() {
  const { level, exp, expToNext, addExp } = useLevel();

  const percent = (exp / expToNext) * 100;

  return (
    <div className="p-4 bg-white/80 rounded-lg shadow-md w-64">
      <div className="text-lg font-bold">Lv. {level}</div>

      <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="text-sm mt-1">
        {exp} / {expToNext} EXP
      </div>

      <button
        onClick={() => addExp(10)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        経験値 +10（テスト）
      </button>
    </div>
  );
}