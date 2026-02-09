import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ForecastRow {
  state_code: string;
  "2024Q1": number;
  "2024Q2": number;
  "2024Q3": number;
  "2024Q4": number;
  pred_q1: number;
  pred_q2: number;
  pred_q3: number;
  pred_q4: number;
}

export interface ProcessedForecast extends ForecastRow {
  qoqChange: number; // (2024Q4 - 2024Q3) / 2024Q3 * 100
}

export function useForecastData() {
  return useQuery({
    queryKey: ["state_quarter_forecast"],
    queryFn: async (): Promise<ProcessedForecast[]> => {
      const { data, error } = await supabase
        .from("state_quarter_forecast")
        .select("state_code, \"2024Q1\", \"2024Q2\", \"2024Q3\", \"2024Q4\", pred_q1, pred_q2, pred_q3, pred_q4");

      if (error) throw error;

      return (data as unknown as ForecastRow[]).map((row) => {
        const q3 = Number(row["2024Q3"]);
        const q4 = Number(row["2024Q4"]);
        const qoqChange = q3 > 0 ? ((q4 - q3) / q3) * 100 : 0;
        return { ...row, qoqChange };
      });
    },
  });
}

// State code to full name mapping
export const stateCodeToName: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};
