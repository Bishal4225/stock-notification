import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BiChart, BiStopwatch } from "react-icons/bi";
import { SearchWatchlistModal } from "./SearchWatchlistModal";
import { trpc } from "@/trpc/client";

interface StockListProps {
  stocks: string[];
  selectedStock: string;
  setSelectedStock: (symbol: string) => void;
  onOpenModal: () => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  selectedStock,
  setSelectedStock,
  onOpenModal,
}) => {
  const toast = useToast();
  const utils = trpc.useUtils();
  const addStockToWatchlistMutation = trpc.watchlist.addStock.useMutation({
    onSuccess: () => {
      utils.watchlist.getAll.invalidate();
      toast({
        title: "Stock added to watchlist.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error adding stock to watchlist",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  const searchModalState = useDisclosure();
  const handleSelectWatchlist = (watchlistId: string) => {
    if (selectedStock) {
      addStockToWatchlistMutation.mutate({
        watchlistId: watchlistId,
        stockSymbol: selectedStock,
      });
    }
  };

  return (
    <Flex height="calc(100vh - 350px)" overflow="hidden" overflowY="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Symbol</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stocks.map((symbol) => (
            <Tr
              key={symbol}
              bg={selectedStock === symbol ? "blue.100" : undefined}
            >
              <Td>
                <HStack justify="space-between">
                  <Text onClick={() => setSelectedStock(symbol)}>{symbol}</Text>
                  <HStack>
                    <Icon fontSize="3xl" as={BiChart} onClick={onOpenModal} />
                    <Icon
                      fontSize="3xl"
                      as={BiStopwatch}
                      onClick={() => {
                        setSelectedStock(symbol);
                        searchModalState.onOpen();
                      }}
                    />
                  </HStack>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <SearchWatchlistModal
        isOpen={searchModalState.isOpen}
        onClose={searchModalState.onClose}
        onSelectWatchlist={handleSelectWatchlist}
      />
    </Flex>
  );
};
