"use client";
import React, { useState } from "react";
import {
  Box,
  VStack,
  Flex,
  Card,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { trpc } from "@/trpc/client";
import { ChartPeriod } from "@/trpc/types";
import { StockFinderFilters } from "./_ui/StockFinderFilters";
import { StockList } from "./_ui/StockList";
import { StockDetailsModal } from "./_ui/StockDetailsModal";
import { Charts } from "./stock/[symbol]/_ui/Charts";

export interface Filters {
  batchSize: number;
  concurrency: number;
  threshold: number;
  chartPeriod: ChartPeriod;
  interval: number;
  scanMode: boolean;
  fromDate: string;
  toDate: string;
}

const StockFinder: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    batchSize: 50,
    concurrency: 5,
    threshold: 0.005,
    chartPeriod: ChartPeriod.Daily,
    interval: 1,
    scanMode: false,
    fromDate: "",
    toDate: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStock, setSelectedStock] = useState<string>("");

  const srMutation = trpc.scanner.getStockBasedOnSupportResistance.useMutation({
    onSuccess: (data) => {
      console.log(data);
      setSelectedStock(data[0]);
    },
  });

  const handleScan = () => {
    srMutation.mutate({
      ...filters,
      batchSize: Number(filters.batchSize),
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
    });
  };

  return (
    <Box p={5}>
      <VStack spacing={4} align="stretch">
        <StockFinderFilters
          filters={filters}
          setFilters={setFilters}
          onScan={handleScan}
          isLoading={srMutation.isPending}
        />
        <Flex gap="4">
          <Card minW="300px">
            <StockList
              stocks={srMutation.data || []}
              selectedStock={selectedStock}
              setSelectedStock={setSelectedStock}
              onOpenModal={onOpen}
            />
          </Card>
          <Card w="79%">
            <Charts
              tradingSymbol={selectedStock}
              period={filters.chartPeriod}
            />
          </Card>
        </Flex>
      </VStack>

      <StockDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        selectedStock={selectedStock}
      />
    </Box>
  );
};

export default StockFinder;
