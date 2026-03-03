import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { WhisperEvent } from "@/types/event";
import { iconForEvent } from "./MarkerIcon";

type Props = {
  events: WhisperEvent[];
};

export function WhisperMap({ events }: Props) {
  const defaultCenter: [number, number] = [35.6804, 139.7690];

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((ev) => (
          <Marker
            key={ev.id}
            position={[ev.lat, ev.lng]}
            icon={iconForEvent(ev)}
          >
            <Popup>
              <div className="text-sm">
                <div>{ev.timestamp}</div>
                <div>time: {ev.conditions.timeOfDay}</div>
                <div>weekend: {String(ev.conditions.isWeekend)}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}