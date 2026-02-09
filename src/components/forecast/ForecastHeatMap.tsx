import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import type { ProcessedForecast } from "@/hooks/useForecastData";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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

type ViewMode = "forecast" | "qoq";

interface ForecastHeatMapProps {
  data: ProcessedForecast[];
  viewMode: ViewMode;
  onStateClick: (stateCode: string) => void;
}

export function ForecastHeatMap({ data, viewMode, onStateClick }: ForecastHeatMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const dataMap = useMemo(() => {
    const map: Record<string, ProcessedForecast> = {};
    data.forEach((d) => { map[d.state_code] = d; });
    return map;
  }, [data]);

  // Color scales
  const { minVal, maxVal } = useMemo(() => {
    const values = data.map((d) =>
      viewMode === "forecast" ? Number(d.pred_q1) : d.qoqChange
    );
    return { minVal: Math.min(...values), maxVal: Math.max(...values) };
  }, [data, viewMode]);

  const getColor = (stateAbbr: string): string => {
    const row = dataMap[stateAbbr];
    if (!row) return "hsl(var(--muted))";

    if (viewMode === "forecast") {
      // Green intensity based on pred_Q1 value
      const val = Number(row.pred_q1);
      const t = maxVal > minVal ? (val - minVal) / (maxVal - minVal) : 0.5;
      // Interpolate from light to dark green
      const h = 142;
      const s = 50 + t * 30;
      const l = 55 - t * 25;
      return `hsl(${h} ${s}% ${l}%)`;
    } else {
      // QoQ: green for positive, red for negative, yellow for neutral
      const change = row.qoqChange;
      if (Math.abs(change) < 0.3) return "hsl(48 90% 50%)"; // yellow
      if (change > 0) {
        const t = Math.min(change / Math.max(maxVal, 1), 1);
        // yellow → green
        const h = 48 + t * 94; // 48 → 142
        const s = 70 + t * 10;
        const l = 45 - t * 10;
        return `hsl(${h} ${s}% ${l}%)`;
      } else {
        const t = Math.min(Math.abs(change) / Math.max(Math.abs(minVal), 1), 1);
        // yellow → red
        const h = 48 - t * 48; // 48 → 0
        const s = 70 + t * 10;
        const l = 45 - t * 5;
        return `hsl(${h} ${s}% ${l}%)`;
      }
    }
  };

  const hoveredRow = hoveredState ? dataMap[hoveredState] : null;

  return (
    <div className="relative w-full">
      {/* Tooltip */}
      {hoveredRow && (
        <div className="absolute top-2 right-2 z-10 bg-card border border-border rounded-lg p-3 shadow-lg min-w-[180px]">
          <p className="font-semibold text-foreground text-sm">{hoveredRow.state_code}</p>
          {viewMode === "forecast" ? (
            <p className="text-xs text-muted-foreground mt-1">
              Pred Q1: <span className="font-mono text-foreground">${Number(hoveredRow.pred_q1).toLocaleString()}M</span>
            </p>
          ) : (
            <p className={`text-xs mt-1 font-mono ${hoveredRow.qoqChange >= 0 ? "text-success" : "text-destructive"}`}>
              QoQ: {hoveredRow.qoqChange >= 0 ? "+" : ""}{hoveredRow.qoqChange.toFixed(1)}%
            </p>
          )}
        </div>
      )}

      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateId = geo.id.toString().padStart(2, "0");
              const stateAbbr = stateIdToAbbr[stateId];
              const fillColor = stateAbbr ? getColor(stateAbbr) : "hsl(var(--muted))";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "hsl(var(--accent))", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={() => stateAbbr && setHoveredState(stateAbbr)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => stateAbbr && onStateClick(stateAbbr)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
