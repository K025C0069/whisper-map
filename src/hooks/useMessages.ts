import { useState, useCallback, useEffect } from "react";
import type { Message } from "@/types/message";
import { loadMessages, saveMessages } from "@/lib/storage";


// 東京駅の座標
const TOKYO_STATION = { lat: 35.6812, lng: 139.7671 };

function generateMockMessages(lat: number, lng: number, prefix: string): Message[] {
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

  return sampleTexts.map((text, i) => ({
    id: `${prefix}-${i}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    // 0.008度（約800m〜1km）の範囲にランダム配置
    lat: lat + (Math.random() - 0.5) * 0.008,
    lng: lng + (Math.random() - 0.5) * 0.008,
    timestamp: Date.now() - Math.random() * 86400000,
  }));
}

export function useMessages(userLat: number | null, userLng: number | null) {
  // 初期状態でモックと保存済みのメッセージを合体させる
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadMessages();
    const mocks = generateMockMessages(TOKYO_STATION.lat, TOKYO_STATION.lng, "tokyo");
    return [...mocks, ...saved];
  });
  const [localMocksGenerated, setLocalMocksGenerated] = useState(false);

  // メッセージが変更されるたびに localStorage に保存する
  useEffect(() => {
    // ユーザーが投稿したメッセージ（idが "msg-" で始まるもの）のみを保存対象にする
    // こうすることで、アプリ起動のたびに生成されるモックの重複保存を防げます
    const userMessages = messages.filter((m) => m.id.startsWith("msg-"));
    saveMessages(userMessages);
  }, [messages]);

  // ユーザーの現在地が取得できたら、その周辺のモックを追加する
  useEffect(() => {
    if (userLat && userLng && !localMocksGenerated) {
      // ユーザーが東京駅にいない場合のみ、現在地用のモックを追加
      const isNearTokyo = 
        Math.abs(userLat - TOKYO_STATION.lat) < 0.005 && 
        Math.abs(userLng - TOKYO_STATION.lng) < 0.005;

      if (!isNearTokyo) {
        const localMocks = generateMockMessages(userLat, userLng, "local");
        setMessages((prev) => [...prev, ...localMocks]);
      }
      setLocalMocksGenerated(true);
    }
  }, [userLat, userLng, localMocksGenerated]);

  const addMessage = useCallback(
    (text: string) => {
      if (!userLat || !userLng) return;
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

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { messages, addMessage, deleteMessage };
}
