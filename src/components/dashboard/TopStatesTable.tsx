import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/data/medicaidData";
import { cn } from "@/lib/utils";

interface TopStatesTableProps {
  data: Array<{
    state: string;
    stateAbbr: string;
    totalSpending: number;
    population: number;
    perCapita: number;
  }>;
}

export function TopStatesTable({ data }: TopStatesTableProps) {
  // Sort by total spending and take top 10
  const tableData = [...data]
    .sort((a, b) => b.totalSpending - a.totalSpending)
    .slice(0, 10);

  const maxSpending = Math.max(...tableData.map((d) => d.totalSpending));

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12 text-muted-foreground font-semibold">#</TableHead>
            <TableHead className="text-muted-foreground font-semibold">State</TableHead>
            <TableHead className="text-right text-muted-foreground font-semibold">
              Total Spending
            </TableHead>
            <TableHead className="text-right text-muted-foreground font-semibold">
              Population
            </TableHead>
            <TableHead className="text-right text-muted-foreground font-semibold">
              Per Capita
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow
              key={row.stateAbbr}
              className={cn(
                "transition-colors hover:bg-accent/30",
                index === 0 && "bg-primary/5"
              )}
            >
              <TableCell className="font-mono text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold",
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : index < 3
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {row.stateAbbr}
                  </span>
                  <span className="font-medium text-foreground">{row.state}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1">
                  <p className="font-mono font-semibold text-foreground">
                    {formatCurrency(row.totalSpending, true)}
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                      style={{
                        width: `${(row.totalSpending / maxSpending) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-muted-foreground">
                {formatNumber(row.population, true)}
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono font-semibold text-primary">
                  {formatCurrency(row.perCapita)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
