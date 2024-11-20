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
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const handleWordTimeoutChange = (value) => {
    const num = parseFloat(value) || 1;
    onSettingsChange({ ...settings, wordTimeout: num });
  };

  const handleShowTranscriptChange = (e) => {
    onSettingsChange({ ...settings, showTranscript: e.target.checked });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Word Timeout (seconds)</FormLabel>
              <NumberInput
                min={1}
                max={10}
                value={settings.wordTimeout}
                onChange={handleWordTimeoutChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper color="white" />
                  <NumberDecrementStepper color="white" />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Show Transcript</FormLabel>
              <Switch
                isChecked={settings.showTranscript}
                onChange={handleShowTranscriptChange}
                colorScheme="green"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    wordTimeout: PropTypes.number.isRequired,
    showTranscript: PropTypes.bool.isRequired,
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired,
};

export default SettingsModal; 