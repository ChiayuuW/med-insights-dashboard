import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableYears, availableStates } from "@/data/medicaidData";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  selectedYear: number;
  selectedState: string;
  onYearChange: (year: number) => void;
  onStateChange: (state: string) => void;
  onReset: () => void;
}

export function FilterBar({
  selectedYear,
  selectedState,
  onYearChange,
  onStateChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        <Select
          value={selectedYear.toString()}
          onValueChange={(v) => onYearChange(parseInt(v))}
        >
          <SelectTrigger className="w-[140px] bg-background border-border">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <Select value={selectedState} onValueChange={onStateChange}>
          <SelectTrigger className="w-[180px] bg-background border-border">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {availableStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset Filters
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-success pulse-live" />
          Live data preview
        </span>
      </div>
    </div>
  );
}
