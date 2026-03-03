import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { WhisperEvent } from "@/types/event";
import { iconForEvent } from "./MarkerIcon";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getDistance } from "@/lib/utils";

type Props = {
  events: WhisperEvent[];
};

export function WhisperMap({ events }: Props) {
  const { position: userPos } = useGeolocation();
  const defaultCenter: [number, number] = [35.6804, 139.7690];
  
  // 表示を制限する距離（例：500メートル）
  const VISIBLE_RADIUS = 500;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={userPos ? [userPos.lat, userPos.lng] : defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((ev) => {
          // 現在地が取得できている場合のみ距離を計算
          const distance = userPos 
            ? getDistance(userPos.lat, userPos.lng, ev.lat, ev.lng) 
            : Infinity;
          
          const isNear = distance <= VISIBLE_RADIUS;

          return (
            <Marker
              key={ev.id}
              position={[ev.lat, ev.lng]}
              icon={iconForEvent(ev)}
            >
              {/* 近くにいる場合のみPopupを表示する、 
                あるいはPopupの中身を条件分岐させる
              */}
              {isNear ? (
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold">近くのメッセージ</div>
                    <div>{ev.timestamp}</div>
                    <div>time: {ev.conditions.timeOfDay}</div>
                    <div>weekend: {String(ev.conditions.isWeekend)}</div>
                  </div>
                </Popup>
              ) : (
                <Popup>
                  <div className="text-sm text-gray-500">
                    遠すぎて内容が読み取れません...<br />
                    (あと {Math.round(distance - VISIBLE_RADIUS)}m)
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}