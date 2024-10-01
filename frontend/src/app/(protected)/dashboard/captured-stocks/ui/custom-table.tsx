import React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

import { makeData, Person } from "./makeData";
import {
  Box,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface CustomTableProps {
  data: any[];
  columns: ColumnDef<any, any>[];
}

function CustomTable(props: CustomTableProps) {
  const { data, columns } = props;
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
  });

  //   //apply the fuzzy sort if the fullName column is being filtered
  //   React.useEffect(() => {
  //     if (table.getState().columnFilters[0]?.id === "fullName") {
  //       if (table.getState().sorting[0]?.id !== "fullName") {
  //         table.setSorting([{ id: "fullName", desc: false }]);
  //       }
  //     }
  //   }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className="p-2">
      <Flex maxW="400px" mb="4">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search Stocks..."
        />
      </Flex>
      <TableContainer>
        <Table>
          <Thead>
            {table?.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <Box
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: "🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </Box>
                        </>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table?.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getAllCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
      size="lg"
    />
  );
}

export default CustomTable;
