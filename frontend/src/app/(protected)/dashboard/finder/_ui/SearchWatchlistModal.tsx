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
  Box,
} from "@chakra-ui/react";
import { trpc } from "@/trpc/client";
import debounce from "lodash/debounce";

interface SearchWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWatchlist: (watchlistId: string) => void;
}

export function SearchWatchlistModal({
  isOpen,
  onClose,
  onSelectWatchlist,
}: SearchWatchlistModalProps) {
  const [searchTerm, setSearchTerm] = useState<undefined | string>();
  const [searchResults, setSearchResults] = useState<
    Array<{ _id: string; name: string; stockSymbols: string[] }>
  >([]);
  const toast = useToast();

  const searchWatchlistsQuery = trpc.watchlist.getAll.useQuery({
    query: searchTerm,
    limit: 10,
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length > 1) {
        searchWatchlistsQuery.refetch();
      } else {
        setSearchResults([]);
      }
    }, 300),
    [searchWatchlistsQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleWatchlistSelect = (watchlistId: string) => {
    onSelectWatchlist(watchlistId);
    onClose();
  };

  React.useEffect(() => {
    if (searchWatchlistsQuery.data) {
      setSearchResults(searchWatchlistsQuery.data.watchlists);
    }
  }, [searchWatchlistsQuery.data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search Watchlists</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search for a watchlist"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <VStack mt={4} align="stretch" spacing={2}>
            {searchResults.map((watchlist) => (
              <Box
                key={watchlist._id}
                p={2}
                borderWidth={1}
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                onClick={() => handleWatchlistSelect(watchlist._id)}
              >
                <Text fontWeight="bold">{watchlist.name}</Text>
              </Box>
            ))}
          </VStack>
          {searchWatchlistsQuery.isLoading && <Text>Loading...</Text>}
          {searchResults.length === 0 &&
            !searchWatchlistsQuery.isLoading &&
            searchTerm &&
            searchTerm?.length > 1 && <Text>No watchlists found</Text>}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
