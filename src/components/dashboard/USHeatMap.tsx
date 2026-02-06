import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { formatNumber } from "@/data/medicaidData";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State FIPS codes to abbreviations mapping
const stateIdToAbbr: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
  "56": "WY",
};

interface USHeatMapProps {
  data: Array<{
    state: string;
    stateAbbr: string;
    totalSpending: number;
    perCapita: number;
  }>;
  previousData: Array<{
    state: string;
    stateAbbr: string;
    totalSpending: number;
    perCapita: number;
  }>;
}

export function USHeatMap({ data, previousData }: USHeatMapProps) {
  // Calculate QoQ changes for each state
  const qoqData = useMemo(() => {
    const changes: Record<string, { change: number; current: number; previous: number; state: string }> = {};
    
    data.forEach((current) => {
      const previous = previousData.find((p) => p.stateAbbr === current.stateAbbr);
      if (previous && previous.totalSpending > 0) {
        const change = ((current.totalSpending - previous.totalSpending) / previous.totalSpending) * 100;
        changes[current.stateAbbr] = {
          change,
          current: current.totalSpending,
          previous: previous.totalSpending,
          state: current.state,
        };
      } else {
        changes[current.stateAbbr] = {
          change: 0,
          current: current.totalSpending,
          previous: 0,
          state: current.state,
        };
      }
    });
    
    return changes;
  }, [data, previousData]);

  // Get min and max changes for color scale
  const { minChange, maxChange } = useMemo(() => {
    const changes = Object.values(qoqData).map((d) => d.change);
    return {
      minChange: Math.min(...changes),
      maxChange: Math.max(...changes),
    };
  }, [qoqData]);

  // Color scale: red for negative, green for positive
  const getColor = (change: number): string => {
    if (change === 0) return "hsl(var(--muted))";
    
    if (change > 0) {
      // Green gradient for positive changes
      const intensity = Math.min(change / Math.max(maxChange, 1), 1);
      const lightness = 45 - intensity * 15; // 45% to 30%
      const saturation = 50 + intensity * 30; // 50% to 80%
      return `hsl(142 ${saturation}% ${lightness}%)`;
    } else {
      // Red gradient for negative changes
      const intensity = Math.min(Math.abs(change) / Math.max(Math.abs(minChange), 1), 1);
      const lightness = 50 - intensity * 15; // 50% to 35%
      const saturation = 50 + intensity * 30; // 50% to 80%
      return `hsl(0 ${saturation}% ${lightness}%)`;
    }
  };

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(0 70% 40%)" }} />
          <span className="text-xs text-muted-foreground">Lower YoY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--muted))" }} />
          <span className="text-xs text-muted-foreground">No Change</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(142 70% 35%)" }} />
          <span className="text-xs text-muted-foreground">Higher YoY</span>
        </div>
      </div>

      {/* Map */}
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
        style={{
          width: "100%",
          height: "auto",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateId = geo.id.toString().padStart(2, "0");
              const stateAbbr = stateIdToAbbr[stateId];
              const stateData = qoqData[stateAbbr];
              const fillColor = stateData ? getColor(stateData.change) : "hsl(var(--muted))";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: "hsl(var(--accent))",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                  onMouseEnter={() => {
                    // Tooltip handled by parent or separate component
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto">
        {Object.entries(qoqData)
          .sort((a, b) => b[1].change - a[1].change)
          .map(([abbr, data]) => (
            <div
              key={abbr}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50"
            >
              <span className="font-mono text-xs font-medium text-foreground">{abbr}</span>
              <span
                className={`text-xs font-mono font-semibold ${
                  data.change > 0
                    ? "text-success"
                    : data.change < 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {data.change > 0 ? "+" : ""}
                {data.change.toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
