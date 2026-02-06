// Sample Medicaid data - Replace with actual Supabase queries once tables are created
// Tables needed: sdud, state_population

export interface StateSpending {
  state: string;
  stateAbbr: string;
  totalSpending: number;
  population: number;
  perCapita: number;
  year: number;
}

export interface YearlyTrend {
  year: number;
  totalSpending: number;
  enrollees: number;
}

// Sample data based on realistic Medicaid spending patterns
const generateStateData = (year: number): StateSpending[] => {
  const states = [
    { state: "California", stateAbbr: "CA", baseSpending: 98.2, population: 39538223 },
    { state: "New York", stateAbbr: "NY", baseSpending: 75.4, population: 20201249 },
    { state: "Texas", stateAbbr: "TX", baseSpending: 45.6, population: 29145505 },
    { state: "Florida", stateAbbr: "FL", baseSpending: 28.9, population: 21538187 },
    { state: "Pennsylvania", stateAbbr: "PA", baseSpending: 32.1, population: 13002700 },
    { state: "Illinois", stateAbbr: "IL", baseSpending: 22.8, population: 12812508 },
    { state: "Ohio", stateAbbr: "OH", baseSpending: 25.4, population: 11799448 },
    { state: "Georgia", stateAbbr: "GA", baseSpending: 14.2, population: 10711908 },
    { state: "North Carolina", stateAbbr: "NC", baseSpending: 17.3, population: 10439388 },
    { state: "Michigan", stateAbbr: "MI", baseSpending: 18.9, population: 10077331 },
    { state: "New Jersey", stateAbbr: "NJ", baseSpending: 16.5, population: 9288994 },
    { state: "Virginia", stateAbbr: "VA", baseSpending: 12.8, population: 8631393 },
    { state: "Washington", stateAbbr: "WA", baseSpending: 14.1, population: 7614893 },
    { state: "Arizona", stateAbbr: "AZ", baseSpending: 13.7, population: 7278717 },
    { state: "Massachusetts", stateAbbr: "MA", baseSpending: 18.4, population: 7029917 },
    { state: "Tennessee", stateAbbr: "TN", baseSpending: 11.2, population: 6910840 },
    { state: "Indiana", stateAbbr: "IN", baseSpending: 12.4, population: 6785528 },
    { state: "Maryland", stateAbbr: "MD", baseSpending: 12.1, population: 6177224 },
    { state: "Missouri", stateAbbr: "MO", baseSpending: 10.8, population: 6154913 },
    { state: "Wisconsin", stateAbbr: "WI", baseSpending: 10.2, population: 5893718 },
    { state: "Colorado", stateAbbr: "CO", baseSpending: 9.8, population: 5773714 },
    { state: "Minnesota", stateAbbr: "MN", baseSpending: 12.6, population: 5706494 },
    { state: "South Carolina", stateAbbr: "SC", baseSpending: 7.9, population: 5118425 },
    { state: "Alabama", stateAbbr: "AL", baseSpending: 6.8, population: 5024279 },
    { state: "Louisiana", stateAbbr: "LA", baseSpending: 9.4, population: 4657757 },
    { state: "Kentucky", stateAbbr: "KY", baseSpending: 11.2, population: 4505836 },
    { state: "Oregon", stateAbbr: "OR", baseSpending: 8.9, population: 4237256 },
    { state: "Oklahoma", stateAbbr: "OK", baseSpending: 6.1, population: 3959353 },
    { state: "Connecticut", stateAbbr: "CT", baseSpending: 9.2, population: 3605944 },
    { state: "Utah", stateAbbr: "UT", baseSpending: 3.8, population: 3271616 },
    { state: "Iowa", stateAbbr: "IA", baseSpending: 5.4, population: 3190369 },
    { state: "Nevada", stateAbbr: "NV", baseSpending: 4.6, population: 3104614 },
    { state: "Arkansas", stateAbbr: "AR", baseSpending: 6.2, population: 3011524 },
    { state: "Mississippi", stateAbbr: "MS", baseSpending: 5.8, population: 2961279 },
    { state: "Kansas", stateAbbr: "KS", baseSpending: 3.9, population: 2937880 },
    { state: "New Mexico", stateAbbr: "NM", baseSpending: 5.7, population: 2117522 },
    { state: "Nebraska", stateAbbr: "NE", baseSpending: 2.8, population: 1961504 },
    { state: "Idaho", stateAbbr: "ID", baseSpending: 2.4, population: 1839106 },
    { state: "West Virginia", stateAbbr: "WV", baseSpending: 4.9, population: 1793716 },
    { state: "Hawaii", stateAbbr: "HI", baseSpending: 2.9, population: 1455271 },
    { state: "New Hampshire", stateAbbr: "NH", baseSpending: 2.1, population: 1377529 },
    { state: "Maine", stateAbbr: "ME", baseSpending: 3.2, population: 1362359 },
    { state: "Rhode Island", stateAbbr: "RI", baseSpending: 2.8, population: 1097379 },
    { state: "Montana", stateAbbr: "MT", baseSpending: 1.8, population: 1084225 },
    { state: "Delaware", stateAbbr: "DE", baseSpending: 2.1, population: 989948 },
    { state: "South Dakota", stateAbbr: "SD", baseSpending: 1.2, population: 886667 },
    { state: "North Dakota", stateAbbr: "ND", baseSpending: 1.1, population: 779094 },
    { state: "Alaska", stateAbbr: "AK", baseSpending: 1.9, population: 733391 },
    { state: "Vermont", stateAbbr: "VT", baseSpending: 1.8, population: 643077 },
    { state: "Wyoming", stateAbbr: "WY", baseSpending: 0.7, population: 576851 },
  ];

  const yearMultiplier = 1 + (year - 2019) * 0.06; // ~6% annual growth
  const variance = () => 0.9 + Math.random() * 0.2;

  return states.map((s) => {
    const spending = s.baseSpending * yearMultiplier * variance();
    return {
      state: s.state,
      stateAbbr: s.stateAbbr,
      totalSpending: Math.round(spending * 1000000000), // Convert to actual dollars
      population: Math.round(s.population * (1 + (year - 2021) * 0.005)), // slight population growth
      perCapita: Math.round((spending * 1000000000) / s.population),
      year,
    };
  });
};

// Generate data for years 2019-2025
export const allStateData: StateSpending[] = [2019, 2020, 2021, 2022, 2023, 2024, 2025].flatMap(
  (year) => generateStateData(year)
);

export const yearlyTrends: YearlyTrend[] = [
  { year: 2019, totalSpending: 626000000000, enrollees: 71000000 },
  { year: 2020, totalSpending: 671000000000, enrollees: 77000000 },
  { year: 2021, totalSpending: 734000000000, enrollees: 85000000 },
  { year: 2022, totalSpending: 805000000000, enrollees: 91000000 },
  { year: 2023, totalSpending: 854000000000, enrollees: 89000000 },
  { year: 2024, totalSpending: 892000000000, enrollees: 84000000 },
  { year: 2025, totalSpending: 938000000000, enrollees: 82000000 },
];

export const availableYears = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export const availableStates = [
  "All States",
  ...allStateData
    .filter((d) => d.year === 2025)
    .map((d) => d.state)
    .sort(),
];

// Utility functions
export const formatCurrency = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    }
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
  }
  return new Intl.NumberFormat("en-US").format(value);
};
