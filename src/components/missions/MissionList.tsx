import { DAILY_MISSIONS, Mission, DailyMissionState } from "@/lib/missions";
import { WhisperEvent } from "@/types/event";
import { PlayerState } from "@/types/player";

export function MissionList({
  events,
  player,
  setPlayer,
  missionState,
  onClaim,
}: {
  events: WhisperEvent[];
  player: PlayerState;
  setPlayer: (p: PlayerState) => void;
  missionState: DailyMissionState;
  onClaim: (mission: Mission) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-bold text-lg">デイリーミッション</h2>

      {DAILY_MISSIONS.map((m) => {
        const done = m.condition(events);
        const claimed = missionState.claimed.includes(m.id);

        const handleClaim = () => {
          if (!done || claimed) return;
          onClaim(m);
        };

        return (
          <div
            key={m.id}
            className={`border rounded-md px-3 py-2 flex items-center justify-between ${
              done ? "border-emerald-400 bg-emerald-50" : "border-slate-300"
            }`}
          >
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-xs text-slate-500">{m.description}</div>
              <div className="text-xs text-blue-500">+{m.rewardExp} EXP</div>
            </div>

            {claimed ? (
              <span className="text-xs text-slate-400">受け取り済み</span>
            ) : done ? (
              <button
                onClick={handleClaim}
                className="text-xs bg-emerald-500 text-white px-2 py-1 rounded"
              >
                受け取る
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}