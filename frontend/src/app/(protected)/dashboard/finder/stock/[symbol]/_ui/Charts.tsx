import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineStyle,
} from "lightweight-charts";
import { trpc } from "@/trpc/client";
import { Box, Select, Flex, Skeleton, Button } from "@chakra-ui/react";
import { ChartPeriod, TimeInterval } from "@/trpc/types";
import { timeIntervals } from "@/utils";
import { SupportResistanceCalculator } from "@/scanner/calculateSupportResistanceChannels";

export interface ChartsProps {
  tradingSymbol: string;
  onFullScreen?: () => void;
  period?: ChartPeriod;
}

export function Charts(props: ChartsProps) {
  const { tradingSymbol, onFullScreen, period } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(() => {
    const defaultTimeInterval = timeIntervals.filter(
      (interval) => interval.period === props.period
    )[0];

    return defaultTimeInterval ?? timeIntervals[7];
  });

  const queryParams = useMemo(() => {
    const toDate = Math.floor(Date.now() / 1000) + 86400;
    return {
      exch: "N",
      tradingSymbol: `${tradingSymbol}-EQ`,
      fromDate: 0,
      toDate,
      timeInterval: selectedInterval.value,
      chartPeriod: selectedInterval.period,
      chartStart: 0,
    };
  }, [tradingSymbol, selectedInterval]);

  const chartDataQuery = trpc.nse.getChartData.useQuery(queryParams, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!tradingSymbol,
  });

  const { data, isLoading } = chartDataQuery;

  const chartData = useMemo(() => {
    if (data?.t) {
      return data.t.map((timestamp, index) => ({
        time: timestamp,
        open: data.o?.[index] ?? 0,
        high: data.h?.[index] ?? 0,
        low: data.l?.[index] ?? 0,
        close: data.c?.[index] ?? 0,
      }));
    }
    return [];
  }, [data]);

  const currentPrice =
    chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
  const SRC = data ? new SupportResistanceCalculator(data, currentPrice) : null;
  const levels = SRC?.calculateLevels();

  useEffect(() => {
    if (chartContainerRef.current && chartData.length > 0) {
      const createNewChart = () => {
        if (chartContainerRef.current) {
          chartRef.current = createChart(chartContainerRef.current, {
            layout: {
              background: { type: ColorType.Solid, color: "white" },
              textColor: "black",
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: {
              mode: CrosshairMode.Normal,
            },
          });

          candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
          });

          candlestickSeriesRef.current.setData(chartData as any);

          // Add support and resistance zones
          if (levels) {
            levels.forEach((level, index) => {
              if (level.LB !== 0 && level.UB !== 0) {
                const color =
                  level.type === "S"
                    ? "rgba(0, 255, 0, 0.2)"
                    : "rgba(255, 0, 0, 0.2)";
                chartRef.current
                  ?.addLineSeries({
                    color: color,
                    lineWidth: 2,
                    lineStyle: LineStyle.Solid,
                    title: `${level.type} ${index + 1}`,
                  })
                  ?.setData([
                    { time: chartData[0].time as any, value: level.LB },
                    {
                      time: chartData[chartData.length - 1].time,
                      value: level.LB,
                    },
                  ]);

                chartRef.current
                  ?.addLineSeries({
                    color: color,
                    lineWidth: 2,
                    lineStyle: LineStyle.Solid,
                    title: `${level.type} ${index + 1}`,
                  })
                  ?.setData([
                    { time: chartData[0].time as any, value: level.UB },
                    {
                      time: chartData[chartData.length - 1].time,
                      value: level.UB,
                    },
                  ]);
              }
            });
          }

          chartRef.current?.timeScale().fitContent();
        }
      };

      const removeChart = () => {
        if (chartRef.current) {
          try {
            chartRef.current.remove();
          } catch (e) {
            console.error("Error removing chart:", e);
          }
          chartRef.current = null;
        }
      };

      removeChart();
      createNewChart();

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        removeChart();
      };
    }
  }, [chartData, levels, tradingSymbol]);

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const interval = timeIntervals.find(
      (interval) => interval.label === event.target.value
    );
    if (interval) {
      setSelectedInterval(interval);
    }
  };

  useEffect(() => {
    if (period) {
      const defaultTimeInterval = timeIntervals.filter(
        (interval) => interval.period === period
      )[0];

      // return defaultTimeInterval ?? timeIntervals[7];

      setSelectedInterval(defaultTimeInterval ?? timeIntervals[7]);
    }
  }, [period]);

  return (
    <Box position="relative" height="100%">
      <Flex
        justifyContent="flex-end"
        bg="white"
        pos="absolute"
        zIndex="10"
        top="0"
        mb={4}
      >
        {onFullScreen && (
          <Button
            onClick={onFullScreen}
            position="absolute"
            top={4}
            right={4}
            colorScheme="blue"
          >
            Full Screen
          </Button>
        )}
        <Select
          value={selectedInterval.label}
          onChange={handleIntervalChange}
          width="180px"
        >
          {timeIntervals.map((interval) => (
            <option key={interval.label} value={interval.label}>
              {interval.label}
            </option>
          ))}
        </Select>
      </Flex>
      {isLoading ? (
        <Skeleton height="100%" width="100%" />
      ) : (
        <Box ref={chartContainerRef} width="100%" height="100%" />
      )}
    </Box>
  );
}
