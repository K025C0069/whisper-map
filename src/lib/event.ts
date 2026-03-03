import { WhisperEvent } from "@/types/event";

export function createWhisperEvent(lat: number, lng: number): WhisperEvent {
  const now = new Date();

  return {
    id: crypto.randomUUID(),
    timestamp: now.toISOString(),
    lat,
    lng,
    conditions: {
      timeOfDay: getTimeOfDay(now),
      isWeekend: isWeekend(now),
    },
    tags: [],
  };
}

function getTimeOfDay(date: Date) {
  const h = date.getHours();
  if (h < 5) return "night";
  if (h < 11) return "morning";
  if (h < 17) return "day";
  if (h < 21) return "evening";
  return "night";
}

function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}