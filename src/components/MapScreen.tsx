import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { Plus, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { GlowMarker } from "@/components/GlowMarker";
import { MessageViewer } from "@/components/MessageViewer";
import { MessageComposer } from "@/components/MessageComposer";
import { MissionList } from "@/components/missions/MissionList";
import { PlayerStatus } from "@/components/player/PlayerStatus";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useMessages } from "@/hooks/useMessages";
import { createWhisperEvent } from "@/lib/event";
import { loadEvents, saveEvents } from "@/lib/storage";
import { loadPlayer, savePlayer, addExp } from "@/lib/player";
import {
  loadMissionState,
  claimMission,
  DailyMissionState,
  Mission,
} from "@/lib/missions";
import { getDistance } from "@/lib/utils";
import { toast } from "@/hooks/use-toast"; 
import type { Message } from "@/types/message";
import type { WhisperEvent } from "@/types/event";    

export default function MapScreen() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const userPulseRef = useRef<L.CircleMarker | null>(null);

  const { position } = useGeolocation();
  
  // position が取得されるまでは null を渡す
  const { messages, addMessage } = useMessages(
    position?.lat ?? null,
    position?.lng ?? null
  );
  const VISIBLE_RADIUS = 500; // 500m以内なら閲覧可能

  const [events, setEvents] = useState<WhisperEvent[]>(loadEvents());
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [hasSetInitialCenter, setHasSetInitialCenter] = useState(false);

  // player & mission states
  const [player, setPlayer] = useState(loadPlayer());
  const [missionState, setMissionState] = useState<DailyMissionState>(
    loadMissionState()
  );

  useEffect(() => {
    savePlayer(player);
  }, [player]);


  // Track location for events
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newEvent = createWhisperEvent(latitude, longitude);
        const updated = [...events, newEvent];
        setEvents(updated);
        saveEvents(updated);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [events]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [position?.lat ?? 35.6812, position?.lng ?? 139.7671],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 位置情報が取得できたら地図を現在地に飛ばす
  useEffect(() => {
    if (mapRef.current && position && !hasSetInitialCenter) {
      // 最初の1回だけ、アニメーションなしで現在地へ移動
      mapRef.current.setView([position.lat, position.lng], 16);
      setHasSetInitialCenter(true);
    }
  }, [position, hasSetInitialCenter]);

  // Update user position marker
  useEffect(() => {
    if (!mapRef.current || !position) return;
    const map = mapRef.current;

    if (userPulseRef.current) userPulseRef.current.remove();
    if (userMarkerRef.current) userMarkerRef.current.remove();

    userPulseRef.current = L.circleMarker([position.lat, position.lng], {
      radius: 18,
      fillColor: "hsl(215, 90%, 60%)",
      fillOpacity: 0.15,
      stroke: false,
      className: "marker-pulse",
    }).addTo(map);

    userMarkerRef.current = L.circleMarker([position.lat, position.lng], {
      radius: 7,
      fillColor: "hsl(215, 90%, 60%)",
      fillOpacity: 1,
      color: "hsl(220, 20%, 7%)",
      weight: 3,
    }).addTo(map);
  }, [position]);

  const handleMarkerClick = useCallback(
    (msg: Message) => {
      if (!position) {
        toast({ title: "位置情報を取得中です" });
        return;
      }

      const distance = getDistance(position.lat, position.lng, msg.lat, msg.lng);

      if (distance <= VISIBLE_RADIUS) {
        setSelectedMessage(msg);
      } else {
        toast({
          variant: "destructive",
          title: "ここからは読めません",
          description: `あと ${Math.round(distance - VISIBLE_RADIUS)}m 近づいてください。`,
        });
      }
    },
    [position]
  );

  const handleClaim = (m: Mission) => {
    if (!m) return;
    setMissionState((s) => claimMission(s, m.id));
    setPlayer((p) => addExp(p, m.rewardExp));
    toast({
      title: `+${m.rewardExp} EXP`,
      description: `${m.title} の報酬を受け取りました`,
    });
  };

  const centerOnUser = () => {
    if (mapRef.current && position) {
      mapRef.current.flyTo([position.lat, position.lng], 16, { duration: 0.8 });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Glow markers */}
      {mapReady &&
        messages.map((msg) => (
          <GlowMarker
            key={msg.id}
            map={mapRef.current}
            message={msg}
            onClick={handleMarkerClick}
          />
        ))}

      {/* Top gradient overlay */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/80 to-transparent z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center pt-12 pb-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary glow-marker" />
          <h1 className="text-sm font-medium tracking-widest text-foreground/80 uppercase">
            すれ違い
          </h1>
        </div>
      </motion.div>

      {/* Player status */}
      <div className="absolute top-0 right-0 z-20 m-4">
        <PlayerStatus player={player} />
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-3 pb-10 pt-16 bg-gradient-to-t from-background/90 to-transparent max-h-96 overflow-y-auto"
      >
        {/* Mission section */}
        {showMissions && (
          <div className="w-full px-4">
            <MissionList
              events={events}
              player={player}
              setPlayer={setPlayer}
              missionState={missionState}
              onClaim={handleClaim}
            />
          </div>
        )}

        {/* Message count */}
        <p className="text-xs text-muted-foreground">
          この付近に {messages.length} 件のメッセージ
        </p>

        <div className="flex items-center gap-3">
          {/* Mission button */}
          <button
            onClick={() => setShowMissions(!showMissions)}
            className="glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-secondary"
            title="ミッション"
          >
            <span className="text-lg">📋</span>
          </button>

          {/* Center button */}
          <button
            onClick={centerOnUser}
            className="glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-secondary"
          >
            <Navigation size={18} className="text-foreground/70" />
          </button>

          {/* Compose button */}
          <button
            onClick={() => setComposerOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              boxShadow: "0 0 20px 4px hsl(185 80% 55% / 0.3)",
            }}
          >
            <Plus size={24} />
          </button>

          {/* Spacer for symmetry */}
          <div className="w-12" />
        </div>
      </motion.div>

      {/* Message viewer */}
      <MessageViewer
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {/* Composer */}
      <MessageComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={addMessage}
      />
    </div>
  );
}
