import { useState } from 'react';
import { Aircraft } from './useSocket';

export const useModal = () => {
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aircraftData, setAircraftData] = useState<Aircraft[]>([]);

  const openContactModal = () => setContactModalVisible(true);
  const closeContactModal = () => setContactModalVisible(false);

  const openInstructionModal = () => setInstructionModalVisible(true);
  const closeInstructionModal = () => setInstructionModalVisible(false);

  const openErrorModal = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage(null);
  };

  return {
    contactModalVisible,
    instructionModalVisible,
    errorModalVisible,
    errorMessage,
    openContactModal,
    closeContactModal,
    openInstructionModal,
    closeInstructionModal,
    openErrorModal,
    closeErrorModal,
  };
};