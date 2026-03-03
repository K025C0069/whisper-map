import L from "leaflet";
import { WhisperEvent } from "@/types/event";

export function iconForEvent(ev: WhisperEvent) {
  const color = getColor(ev);
  const isMine = ev.id.startsWith("msg-"); // 自分のコメント判定

  return L.divIcon({
    className: "",
    html: `<div style="
      width: ${isMine ? "18px" : "14px"};
      height: ${isMine ? "18px" : "14px"};
      background: ${color};
      border-radius: 50%;
      /* 自分の場合は太い白枠に加えて、外側に色のついた光彩をつけて目立たせる */
      border: ${isMine ? "3px solid white" : "2px solid white"};
      box-shadow: ${
        isMine 
          ? `0 0 0 2px ${color}, 0 0 10px rgba(244, 63, 94, 0.6)` 
          : "0 0 4px rgba(0,0,0,0.3)"
      };
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
  });
}

function getColor(ev: WhisperEvent) {
  // 自分のコメント（IDが "msg-" で始まる）は緑色
  if (ev.id.startsWith("msg-")) {
    return "#22c55e"; // Green (Tailwind green-500)
  }

  // 他人のコメント用の色リスト（青、赤、黄色）
  const otherColors = [
    "#3b82f6", // Blue (Tailwind blue-500)
    "#ef4444", // Red (Tailwind red-500)
    "#eab308", // Yellow (Tailwind yellow-500)
  ];

  // IDに基づいて色を決定（毎回同じIDなら同じ色になるようにハッシュ化）
  let hash = 0;
  for (let i = 0; i < ev.id.length; i++) {
    hash = ev.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % otherColors.length;
  
  return otherColors[index];
}