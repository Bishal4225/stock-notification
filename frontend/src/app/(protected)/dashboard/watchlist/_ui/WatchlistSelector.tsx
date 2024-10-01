// WatchlistSelector.js
import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  HStack,
  Icon,
  Divider,
  MenuGroup,
  Box,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaWineGlassEmpty } from "react-icons/fa6";
import { EditWatchlist } from "./EditWatchlist";
import DeleteWatchlistButton from "./DeleteWatchlistButton";
import { trpc } from "@/trpc/client";
import { Watchlist } from "../page";

interface WatchlistSelectorProps {
  watchlists: Watchlist[];
  selectedWatchlist: Watchlist | null;
  setSelectedWatchlist: (watchlist: Watchlist) => void;
}

export default function WatchlistSelector({
  watchlists,
  selectedWatchlist,
  setSelectedWatchlist,
}: WatchlistSelectorProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const utils = trpc.useUtils();

  const deleteWatchlistMutation = trpc.watchlist.delete.useMutation({
    onSuccess: () => {
      utils.watchlist.getAll.invalidate();
      toast({
        title: "Watchlist deleted.",
        description: "Your watchlist has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
      });
    },
  });

  return (
    <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <MenuButton as={Button}>
        {selectedWatchlist?.name ?? "Create Watchlist"}
      </MenuButton>
      <MenuList>
        <EditWatchlist />
        {selectedWatchlist && (
          <EditWatchlist watchlist={selectedWatchlist} isEditMode />
        )}
        <MenuItem>
          <HStack>
            <Icon as={FaWineGlassEmpty} />
            <Text> Clear List</Text>
          </HStack>
        </MenuItem>
        <Divider />
        <MenuGroup title="Watchlists" gap={0}>
          {watchlists.map((watchlist) => (
            <HStack key={watchlist._id} gap={0}>
              <Box
                p="2"
                w="full"
                onClick={() => {
                  setSelectedWatchlist(watchlist);
                  onClose();
                }}
                _hover={{
                  bg: "gray.100",
                }}
              >
                {watchlist.name} {watchlist.stockSymbols?.length || ""}
              </Box>
              <DeleteWatchlistButton
                watchlistId={watchlist._id}
                watchlistName={watchlist.name}
                onDelete={() => {
                  deleteWatchlistMutation.mutate(watchlist._id);
                }}
              />
            </HStack>
          ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
