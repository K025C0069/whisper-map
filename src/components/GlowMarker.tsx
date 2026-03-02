import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Message } from "@/types/message";

interface GlowMarkerProps {
  map: L.Map | null;
  message: Message;
  onClick: (message: Message) => void;
}

const GLOW_COLORS = [
  "hsl(185, 80%, 55%)",  // cyan
  "hsl(260, 60%, 65%)",  // purple
  "hsl(35, 90%, 60%)",   // warm
  "hsl(150, 60%, 50%)",  // green
  "hsl(320, 60%, 60%)",  // pink
];

function getColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return GLOW_COLORS[Math.abs(hash) % GLOW_COLORS.length];
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
