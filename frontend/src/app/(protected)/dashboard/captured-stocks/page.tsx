"use client";

import { trpc } from "@/trpc/client";
import { ResponsiveCalendar } from "@nivo/calendar";
import {
  Badge,
  Box,
  Heading,
  Skeleton,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import CustomTable from "./ui/custom-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface CapturedStocksPageProps {}

export default function CapturedStocksPage(props: CapturedStocksPageProps) {
  const [date, setDate] = useState<string>();
  const {} = props;

  const capturedStocksQuery = trpc.stockScreener.getCapturedStocks.useQuery({
    date: date,
  });

  const capturedStocksByDateQuery =
    trpc.stockScreener.getCapturedStocksByDate.useQuery();

  const calendarData =
    capturedStocksByDateQuery.data?.map((item) => {
      return {
        value: item.total,
        day: item._id,
      };
    }) ?? [];

  const stocksData = capturedStocksQuery.data ?? [];

  const columns = useMemo<ColumnDef<(typeof stocksData)[0], any>[]>(
    () => [
      {
        id: "stockSymbol",
        accessorFn: (row) => row.stockSymbol,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
        cell: (info) => (
          <Text fontSize="lg" fontWeight="bold">
            <Link href={`/dashboard/finder/stock/${info.getValue()}`}>
              {info.getValue()}
            </Link>
          </Text>
        ),
        header: () => <span>Stock Name</span>,
      },
      {
        accessorFn: (row) => row.stockType,
        id: "stockType",
        cell: (info) => (
          <Tag
            colorScheme={
              info.getValue() === "UP"
                ? "green"
                : info.getValue() === "DOWN"
                ? "red"
                : "gray.100"
            }
          >
            {info.renderValue().toUpperCase()}
          </Tag>
        ),
        header: () => <span>Trend</span>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => row.change, //note: normal non-fuzzy filter column - case sensitive
        id: "change",
        cell: (info) => (
          <Box
            fontSize="lg"
            color={
              info.getValue() > 0
                ? "green"
                : info.getValue() < 0
                ? "red"
                : "gray.100"
            }
          >
            {info.renderValue().toFixed(2)}%
          </Box>
        ),
        header: () => <span>Change%</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
    ],
    []
  );

  if (capturedStocksByDateQuery.isPending || capturedStocksQuery.isPending) {
    return (
      <Stack gap={8}>
        <Skeleton
          height="300px"
          isLoaded={capturedStocksByDateQuery.isSuccess}
        />
        <Skeleton height="800px" isLoaded={capturedStocksQuery.isSuccess} />
      </Stack>
    );
  }

  return (
    <>
      <Heading textAlign="center">Captured Stocks</Heading>

      <Box height="300px" w="full">
        <ResponsiveCalendar
          data={calendarData}
          from="2024-01-01"
          to="2024-12-31"
          emptyColor="#eeeeee"
          colors={["#61cd6a", "#33db68", "#0dab0b", "#066f00"]}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          onClick={(day, event) => {
            setDate(day.day);
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "row",
              // translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              // itemDirection: "right-to-left",
            },
          ]}
        />
      </Box>

      <CustomTable data={stocksData} columns={columns} />
    </>
  );
}
