// WatchlistPage.js
"use client";
import React, { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useToast, Flex, Stack, Card, useDisclosure } from "@chakra-ui/react";
import WatchlistSelector from "./_ui/WatchlistSelector";
import WatchlistContent from "./_ui/WatchlistContent";
import { SearchStockModal } from "./_ui/SearchStockModal";
import { Charts } from "../finder/stock/[symbol]/_ui/Charts";

export interface Watchlist {
  _id: string;
  name: string;
  stockSymbols: string[];
}

export default function WatchlistPage() {
  const [currentSelectedStock, setCurrenSelectedStock] = useState<
    string | null
  >(null);

  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(
    null
  );
  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose,
  } = useDisclosure();
  const toast = useToast();
  const utils = trpc.useUtils();

  const watchlistQuery = trpc.watchlist.getAll.useQuery({});
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

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("selectedWatchlist");
    if (savedWatchlist) {
      setSelectedWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  useEffect(() => {
    if (selectedWatchlist) {
      localStorage.setItem(
        "selectedWatchlist",
        JSON.stringify(selectedWatchlist)
      );
    }
  }, [selectedWatchlist]);

  useEffect(() => {
    const watchlistQueryData = watchlistQuery.data;
    const watchlists = watchlistQueryData?.watchlists || [];
    if (watchlists.length > 0 && !selectedWatchlist) {
      setSelectedWatchlist(watchlists[0]);
    } else if (selectedWatchlist) {
      const updatedWatchlist = watchlists.find(
        (w) => w._id === selectedWatchlist._id
      );
      if (updatedWatchlist) {
        setSelectedWatchlist(updatedWatchlist);
      }
    }
  }, [watchlistQuery.data, selectedWatchlist]);

  const handleAddStock = (symbol: string) => {
    if (selectedWatchlist) {
      addStockToWatchlistMutation.mutate({
        watchlistId: selectedWatchlist._id,
        stockSymbol: symbol,
      });
    }
  };

  return (
    <Flex h="full">
      <Stack minW="300px" as={Card} h="full" p="2">
        <WatchlistSelector
          watchlists={watchlistQuery.data?.watchlists || []}
          selectedWatchlist={selectedWatchlist}
          setSelectedWatchlist={setSelectedWatchlist}
        />
        <WatchlistContent
          setCurrenSelectedStock={setCurrenSelectedStock}
          selectedWatchlist={selectedWatchlist}
          onSearchModalOpen={onSearchModalOpen}
        />
      </Stack>
      <Stack w="full">
        {currentSelectedStock && (
          <Charts tradingSymbol={currentSelectedStock} />
        )}
      </Stack>
      <SearchStockModal
        isOpen={isSearchModalOpen}
        onClose={onSearchModalClose}
        onAddStock={handleAddStock}
      />
    </Flex>
  );
}
