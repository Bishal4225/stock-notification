import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import StockDetails from "../stock/[symbol]/_ui/StockDetails";

interface StockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStock: string;
}

export const StockDetailsModal: React.FC<StockDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedStock,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Equity Details for {selectedStock}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StockDetails tradingSymbol={selectedStock} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
