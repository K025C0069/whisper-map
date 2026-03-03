import { PlayerState } from "@/types/player";

export function PlayerStatus({ player }: { player: PlayerState }) {
  const percent = (player.exp / player.nextExp) * 60;

  return (
    <div className="p-3 border rounded-md bg-white">
      <div className="font-bold text-lg">レベル {player.level}</div>

      <div className="text-xs text-slate-500 mb-1">
        {player.exp} / {player.nextExp} EXP
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