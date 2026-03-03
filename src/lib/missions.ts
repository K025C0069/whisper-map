import { WhisperEvent } from "@/types/event";

export type Mission = {
  id: string;
  title: string;
  description: string;
  type: "daily";
  rewardExp: number; // 日替わりミッション報酬 (経験値)
  condition: (events: WhisperEvent[]) => boolean;
};

export type DailyMissionState = {
  date: string; // yyyy-mm-dd
  claimed: string[]; // ミッションID
};

const STATE_KEY = "daily-mission-state";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function loadMissionState(): DailyMissionState {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as DailyMissionState;
      if (parsed.date !== getToday()) {
        return { date: getToday(), claimed: [] };
      }
      return parsed;
    } catch (e) {
      console.error("failed to parse mission state", e);
    }
  }
  return { date: getToday(), claimed: [] };
}

export function saveMissionState(state: DailyMissionState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function claimMission(
  state: DailyMissionState,
  missionId: string
): DailyMissionState {
  if (state.claimed.includes(missionId)) return state;
  const newState = { ...state };
  newState.claimed = [...newState.claimed, missionId];
  saveMissionState(newState);
  return newState;
}

export const DAILY_MISSIONS: Mission[] = [
  {
    id: "daily-3-events",
    type: "daily",
    title: "今日は3回すれ違おう",
    description: "1日の中で3回以上すれ違いを記録する",
    rewardExp: 50,
    condition: (events) => events.length >= 3,
  },
  {
    id: "night-event",
    type: "daily",
    title: "夜のささやき",
    description: "夜に1回すれ違う",
    rewardExp: 30,
    condition: (events) =>
      events.some((e) => e.conditions.timeOfDay === "night"),
  },
  {
    id: "morning-event",
    type: "daily",
    title: "朝の出会い",
    description: "朝に1回すれ違う",
    rewardExp: 30,
    condition: (events) =>
      events.some((e) => e.conditions.timeOfDay === "morning"),
  },
];