import { useState, useCallback } from "react";
import type { Message } from "@/types/message";

// Generate some mock messages around a position
function generateMockMessages(lat: number, lng: number): Message[] {
  const sampleTexts = [
    "ここ、春になると桜が綺麗なんだよね 🌸",
    "この角のパン屋さんのクロワッサン、絶品です！",
    "今日はいい天気。散歩日和だなぁ ☀️",
    "誰かおすすめのランチ教えてください！",
    "ふと見上げた空が綺麗でした",
    "ここの公園、静かで落ち着く...",
    "雨が降りそう。傘持ってきてよかった ☔️",
    "夜のこの道の雰囲気、すごく好き",
    "猫が日向ぼっこしてた 🐈",
    "今日も一日お疲れ様でした！",
  ];

  return sampleTexts.map((text, i) => {
    const offsetRange = i % 3 === 0 ? 0.012 : 0.004;

    return {
      id: `mock-${i}`,
      text,
      lat: lat + (Math.random() - 0.5) * offsetRange,
      lng: lng + (Math.random() - 0.5) * offsetRange,
      timestamp: Date.now() - Math.random() * 172800000,
    };
  });
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

  // 全てのメッセージを返す（表示判定はコンポーネント側で行う）
  return { messages, addMessage };
}
