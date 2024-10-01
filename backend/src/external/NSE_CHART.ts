import { z } from "zod";
import axios from "axios";
import { OHLCData } from "../types";

export enum ChartPeriod {
  Intraday = "I",
  Daily = "D",
  Weekly = "W",
  Monthly = "M",
}

export const ChartDataInputSchema = z.object({
  exch: z.string(),
  tradingSymbol: z.string(),
  fromDate: z.number(),
  toDate: z.number(),
  timeInterval: z.number(),
  chartPeriod: z.nativeEnum(ChartPeriod),
  chartStart: z.number(),
});

type ChartDataInput = z.infer<typeof ChartDataInputSchema>;

async function fetchChartData(input: ChartDataInput) {
  const url = "https://charting.nseindia.com/Charts/ChartData/";

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json; charset=utf-8",
    origin: "https://charting.nseindia.com",
    "user-agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
  };

  try {
    const response = await axios.post<OHLCData>(url, input, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
}

function transformChartData(rawData: any): { candles: any[][] } {
  if (
    !rawData ||
    !rawData.t ||
    !rawData.o ||
    !rawData.h ||
    !rawData.l ||
    !rawData.c ||
    !rawData.v
  ) {
    throw new Error("Invalid data format");
  }

  const { t, o, h, l, c, v } = rawData;
  const candles = t.map((timestamp: number, index: number) => {
    // Round to nearest 15-minute interval
    const roundedTimestamp = Math.floor(timestamp / (15 * 60)) * (15 * 60);
    const date = new Date(roundedTimestamp * 1000);
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    return [
      formattedDate,
      parseFloat(o[index]),
      parseFloat(h[index]),
      parseFloat(l[index]),
      parseFloat(c[index]),
      parseInt(v[index]),
    ];
  });

  return { candles };
}

export const getChartData = async (input: ChartDataInput) => {
  try {
    const rawChartData = await fetchChartData(input);
    // const transformedData = transformChartData(rawChartData);
    return rawChartData;
  } catch (error) {
    console.error(error);
  }
};

export const getTransformedChartData = async (input: ChartDataInput) => {
  try {
    const rawChartData = await fetchChartData(input);
    const transformedData = transformChartData(rawChartData);
    return transformedData;
  } catch (error) {
    console.error(error);
  }
};
