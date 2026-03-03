import { useLevel } from "@/contexts/LevelContext";

export function PlayerStatus() {
  const { level, exp, expToNext } = useLevel();
  const percent = (exp / expToNext) * 100;

  return (
    <div className="p-3 border rounded-md bg-white">
      <div className="font-bold text-lg">レベル {level}</div>

      <div className="text-xs text-slate-500 mb-1">
        {exp} / {expToNext} EXP
      </div>

      <div className="w-full h-2 bg-slate-200 rounded">
        <div
          className="h-full bg-emerald-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}