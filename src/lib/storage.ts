import { WhisperEvent } from "@/types/event";
import { Message } from "@/types/message";

const KEY = "whisper-events";
const MESSaGE_KEY = "whisper-messages";

export function loadEvents(): WhisperEvent[] {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function saveEvents(events: WhisperEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function loadMessages(): Message[] {
  return JSON.parse(localStorage.getItem(MESSaGE_KEY) || "[]");
}

export function saveMessages(messages: Message[]) {
  localStorage.setItem(MESSaGE_KEY, JSON.stringify(messages));
}