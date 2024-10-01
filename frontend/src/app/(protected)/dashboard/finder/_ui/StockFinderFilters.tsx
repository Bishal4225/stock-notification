import React from "react";
import {
  HStack,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Input,
  Button,
} from "@chakra-ui/react";
import { ChartPeriod } from "@/trpc/types";
import { Filters } from "../page";

interface StockFinderFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onScan: () => void;
  isLoading: boolean;
}

export const StockFinderFilters: React.FC<StockFinderFiltersProps> = ({
  filters,
  setFilters,
  onScan,
  isLoading,
}) => {
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleScanModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: any) => ({ ...prev, scanMode: e.target.checked }));
  };

  return (
    <>
      <HStack alignItems="flex-end" spacing={4}>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="scan-mode" mb="0">
            Scan Mode
          </FormLabel>
          <Switch
            id="scan-mode"
            isChecked={filters.scanMode}
            onChange={handleScanModeChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Chart Period</FormLabel>
          <Select
            name="chartPeriod"
            value={filters.chartPeriod}
            onChange={handleFilterChange}
          >
            {Object.values(ChartPeriod).map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Batch Size</FormLabel>
          <Input
            name="batchSize"
            type="number"
            value={filters.batchSize}
            onChange={handleFilterChange}
            placeholder="Batch Size"
            isDisabled={!filters.scanMode}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Threshold</FormLabel>
          <Input
            name="threshold"
            type="number"
            step="0.001"
            value={filters.threshold}
            onChange={handleFilterChange}
            placeholder="Threshold"
            isDisabled={!filters.scanMode}
          />
        </FormControl>
        <FormControl>
          <FormLabel>From Date</FormLabel>
          <Input
            name="fromDate"
            type="date"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>To Date</FormLabel>
          <Input
            name="toDate"
            type="date"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
        </FormControl>
      </HStack>
      <Button colorScheme="blue" isLoading={isLoading} onClick={onScan}>
        {filters.scanMode ? "Scan" : "Fetch"}
      </Button>
    </>
  );
};
