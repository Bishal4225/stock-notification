import { ChartPeriod, TimeInterval } from "@/trpc/types";

export const timeIntervals: TimeInterval[] = [
  { label: "1min", value: 1, period: ChartPeriod.Intraday },
  { label: "3min", value: 3, period: ChartPeriod.Intraday },
  { label: "5min", value: 5, period: ChartPeriod.Intraday },
  { label: "10min", value: 10, period: ChartPeriod.Intraday },
  { label: "15min", value: 15, period: ChartPeriod.Intraday },
  { label: "30min", value: 30, period: ChartPeriod.Intraday },
  { label: "60min", value: 60, period: ChartPeriod.Intraday },
  { label: "1day", value: 1, period: ChartPeriod.Daily },
  { label: "1week", value: 1, period: ChartPeriod.Weekly },
  { label: "1month", value: 1, period: ChartPeriod.Monthly },
];
