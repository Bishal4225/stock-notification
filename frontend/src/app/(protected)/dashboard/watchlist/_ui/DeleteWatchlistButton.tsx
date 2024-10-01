import React from "react";
import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { trpc } from "@/trpc/client";
import AlertDailogModal from "@/components/AlertDailogModal";

interface DeleteWatchlistButtonProps {
  watchlistId: string;
  watchlistName: string;
  onDelete: () => void;
}

const DeleteWatchlistButton: React.FC<DeleteWatchlistButtonProps> = ({
  watchlistId,
  watchlistName,
  onDelete,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const utils = trpc.useContext();

  const deleteWatchlistMutation = trpc.watchlist.delete.useMutation({
    onSuccess: () => {
      utils.watchlist.getAll.invalidate();
      onDelete();
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
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = () => {
    deleteWatchlistMutation.mutate(watchlistId);
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label="Delete Watchlist"
        icon={<DeleteIcon />}
        variant="ghost"
        onClick={onOpen}
      />
      <AlertDailogModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete Watchlist"
        message={`Are you sure you want to delete the watchlist "${watchlistName}"? This action cannot be undone.`}
      />
    </>
  );
};

export default DeleteWatchlistButton;
