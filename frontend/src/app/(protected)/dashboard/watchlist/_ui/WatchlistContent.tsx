// WatchlistContent.js
import React from "react";
import { HStack, Text, IconButton, Icon, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa6";
import { trpc } from "@/trpc/client";
import { Watchlist } from "../page";

interface WatchlistContentProps {
  selectedWatchlist: Watchlist | null;
  onSearchModalOpen: () => void;
  setCurrenSelectedStock: (stock: string) => void;
}

export default function WatchlistContent({
  selectedWatchlist,
  onSearchModalOpen,
  setCurrenSelectedStock,
}: WatchlistContentProps) {
  const toast = useToast();
  const utils = trpc.useUtils();

  const removeStockFromWatchlistMutation =
    trpc.watchlist.removeStock.useMutation({
      onSuccess: () => {
        utils.watchlist.getAll.invalidate();
        toast({
          title: "Stock removed from watchlist.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast({
          title: "Error removing stock from watchlist",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });

  const handleRemoveStock = (symbol: string) => {
    if (selectedWatchlist) {
      removeStockFromWatchlistMutation.mutate({
        watchlistId: selectedWatchlist._id,
        stockSymbol: symbol,
      });
    }
  };

  return (
    <>
      <HStack justify="space-between">
        <Text>Watchlist</Text>
        <HStack>
          <IconButton
            aria-label="Add Stock to Watchlist"
            icon={<AddIcon />}
            onClick={onSearchModalOpen}
          />
        </HStack>
      </HStack>
      {selectedWatchlist && (
        <>
          <Text>Stocks in {selectedWatchlist?.name}:</Text>
          {selectedWatchlist?.stockSymbols?.map((symbol) => (
            <HStack key={symbol} justifyContent="space-between">
              <Text onClick={() => setCurrenSelectedStock(symbol)}>
                {symbol}
              </Text>
              <IconButton
                aria-label="Remove Stock"
                icon={<Icon as={FaTrash} />}
                size="sm"
                onClick={() => handleRemoveStock(symbol)}
              />
            </HStack>
          ))}
        </>
      )}
    </>
  );
}
