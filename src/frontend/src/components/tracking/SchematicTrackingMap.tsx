import { MapPin } from 'lucide-react';
import type { Location } from '../../backend';

interface SchematicTrackingMapProps {
  location: Location;
}

export default function SchematicTrackingMap({ location }: SchematicTrackingMapProps) {
  // Normalize coordinates to a 0-100 scale for positioning
  // Latitude: -90 to 90 -> 0 to 100 (inverted for screen coordinates)
  // Longitude: -180 to 180 -> 0 to 100
  const normalizedLat = ((90 - location.latitude) / 180) * 100;
  const normalizedLng = ((location.longitude + 180) / 360) * 100;

  return (
    <div className="relative w-full aspect-video rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 overflow-hidden">
      {/* Grid Background */}
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-amber-400 dark:text-amber-600"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Coordinate Labels */}
      <div className="absolute top-2 left-2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        N
      </div>
      <div className="absolute bottom-2 left-2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        S
      </div>
      <div className="absolute top-2 right-2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        E
      </div>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        W
      </div>

      {/* Driver Marker */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
        style={{
          left: `${normalizedLng}%`,
          top: `${normalizedLat}%`,
        }}
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 -m-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/30 dark:bg-amber-400/20 animate-ping" />
        </div>
        
        {/* Marker Icon */}
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-amber-600 dark:bg-amber-500 shadow-lg border-4 border-white dark:border-gray-900">
          <MapPin className="h-6 w-6 text-white fill-white" />
        </div>

        {/* Label */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="bg-amber-600 dark:bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            Driver
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-600 dark:bg-amber-500" />
          <span className="text-xs font-medium">Live Position</span>
        </div>
      </div>
    </div>
  );
}
