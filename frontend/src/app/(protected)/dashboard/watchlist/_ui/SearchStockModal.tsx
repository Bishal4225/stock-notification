import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { trpc } from "@/trpc/client";
import debounce from "lodash/debounce";

interface SearchStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (symbol: string) => void;
}

export function SearchStockModal({
  isOpen,
  onClose,
  onAddStock,
}: SearchStockModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    { symbol: string; name: string }[]
  >([]);
  const toast = useToast();

  const searchStocksMutation = trpc.watchlist.searchStockSymbols.useMutation({
    onError: (error) => {
      toast({
        title: "Error searching stocks",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length > 1) {
        searchStocksMutation.mutate(term, {
          onSuccess: (data) => {
            setSearchResults(data);
          },
        });
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleStockSelect = (symbol: string) => {
    onAddStock(symbol);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search Stocks</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search for a stock symbol"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <VStack mt={4} align="stretch">
            {searchResults.map((symbol) => (
              <Button
                key={symbol.name}
                onClick={() => handleStockSelect(symbol.symbol)}
                variant="ghost"
              >
                {symbol.name}
              </Button>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
