import { useState, useCallback } from "react";
import type { Message } from "@/types/message";

// Generate some mock messages around a position
function generateMockMessages(lat: number, lng: number): Message[] {
  const messages = [
    "今日の空、きれいだった",
    "ここのカフェ最高",
    "誰かに届きますように",
    "雨の匂いがする",
    "この道、好きだな",
    "ふと立ち止まった",
    "また来たいな",
    "風が気持ちいい",
    "夜の散歩は最高",
    "ここで待ってる",
  ];

  return messages.map((text, i) => ({
    id: `mock-${i}`,
    text,
    lat: lat + (Math.random() - 0.5) * 0.008,
    lng: lng + (Math.random() - 0.5) * 0.008,
    timestamp: Date.now() - Math.random() * 86400000,
  }));
}

export function useMessages(userLat: number, userLng: number) {
  const [messages, setMessages] = useState<Message[]>(() =>
    generateMockMessages(userLat, userLng)
  );

  const addMessage = useCallback(
    (text: string) => {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        text,
        lat: userLat,
        lng: userLng,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMsg]);
    },
    [userLat, userLng]
  );

  return { messages, addMessage };
}
