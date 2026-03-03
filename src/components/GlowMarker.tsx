import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Message } from "@/types/message";

interface GlowMarkerProps {
  map: L.Map | null;
  message: Message;
  onClick: (message: Message) => void;
}

const OTHER_GLOW_COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(0, 84%, 60%)",   // Red
  "hsl(45, 93%, 47%)",  // Yellow
];

function getColor(id: string) {
  // 自分のメッセージは緑色
  if (id.startsWith("msg-")) {
    return "hsl(142, 71%, 45%)"; // Green
  }

  // 他人のメッセージは青・赤・黄色からIDに基づいて選択
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return OTHER_GLOW_COLORS[Math.abs(hash) % OTHER_GLOW_COLORS.length];
}

export function GlowMarker({ map, message, onClick }: GlowMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const color = getColor(message.id);
    const delay = Math.random() * 3;

    const icon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <div class="marker-pulse" style="
            position:absolute;
            width:36px;
            height:36px;
            border-radius:50%;
            background:${color};
            opacity:0.2;
            animation-delay:${delay}s;
          "></div>
          <div class="marker-float" style="
            width:14px;
            height:14px;
            border-radius:50%;
            background:${color};
            box-shadow: 0 0 10px 3px ${color}80, 0 0 25px 6px ${color}30;
            animation-delay:${delay * 0.7}s;
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const marker = L.marker([message.lat, message.lng], { icon });
    marker.addTo(map);
    marker.on("click", () => onClick(message));
    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map, message, onClick]);

  return null;
}
