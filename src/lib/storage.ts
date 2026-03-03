import { WhisperEvent } from "@/types/event";

const KEY = "whisper-events";

export function loadEvents(): WhisperEvent[] {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveEvents(events: WhisperEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(events));
}