import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  MenuItem,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { trpc } from "@/trpc/client";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Watchlist } from "../page";

export interface EditWatchlistProps {
  watchlist?: Watchlist;
  isEditMode?: boolean;
}

export function EditWatchlist({ watchlist, isEditMode }: EditWatchlistProps) {
  const utils = trpc.useUtils();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [watchlistName, setWatchlistName] = useState(() => {
    return watchlist?.name;
  });
  const toast = useToast();

  const createWatchlistMutation = trpc.watchlist.create.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const updateWatchlistMutation = trpc.watchlist.update.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  function handleSuccess() {
    utils.watchlist.getAll.invalidate();

    toast({
      title: `Watchlist ${isEditMode ? "updated" : "created"}.`,
      description: `Your watchlist has been ${
        isEditMode ? "updated" : "created"
      } successfully.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
    setWatchlistName("");
  }

  function handleError(error: any) {
    toast({
      title: `Error ${isEditMode ? "updating" : "creating"} watchlist.`,
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  const handleSubmit = () => {
    if (isEditMode && watchlist) {
      updateWatchlistMutation.mutate({
        id: watchlist._id,
        name: watchlistName,
      });
    } else {
      createWatchlistMutation.mutate({ name: watchlistName ?? "" });
    }
  };

  const isPending =
    createWatchlistMutation.isPending || updateWatchlistMutation.isPending;

  return (
    <>
      <MenuItem onClick={onOpen}>
        <HStack>
          <Icon as={isEditMode ? EditIcon : AddIcon} />
          <Text>{isEditMode ? "Edit List" : "Create New List"}</Text>
        </HStack>
      </MenuItem>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Watchlist" : "Create New Watchlist"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Watchlist Name</FormLabel>
              <Input
                value={watchlistName}
                onChange={(e) => setWatchlistName(e.target.value)}
                placeholder="Enter watchlist name"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isPending}
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
