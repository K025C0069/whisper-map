export type WhisperEvent = {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  conditions: {
    timeOfDay: 'morning' | 'day' | 'evening' | 'night';
    isWeekend: boolean;
    weather?: string;
    areaTag?: string;
  };
  tags: string[];
  partnerId?: string;
};