import L from "leaflet";
import { WhisperEvent } from "@/types/event";

export function iconForEvent(ev: WhisperEvent) {
  const color = getColor(ev);

  return L.divIcon({
    className: "",
    html: `<div style="
      width: 14px;
      height: 14px;
      background: ${color};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    "></div>`,
  });
}

function getColor(ev: WhisperEvent) {
  if (ev.conditions.timeOfDay === "night") return "#4f46e5";
  if (ev.conditions.timeOfDay === "evening") return "#f97316";
  if (ev.conditions.timeOfDay === "morning") return "#22c55e";
  return "#3b82f6";
}