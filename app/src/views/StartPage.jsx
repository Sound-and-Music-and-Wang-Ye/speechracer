import { Box, VStack, Text, Button, SimpleGrid, Tooltip } from '@chakra-ui/react';
import { FaChild, FaRunning, FaBolt, FaFire } from 'react-icons/fa';
import PropTypes from 'prop-types';

const DifficultyButton = ({ icon: Icon, label, color, onClick, tooltip }) => (
  <Tooltip label={tooltip} fontSize="md" placement="top">
    <Button
      onClick={onClick}
      size="lg"
      height="200px"
      width="200px"
      flexDirection="column"
      gap={4}
      colorScheme={color}
      _hover={{ transform: 'scale(1.05)' }}
      transition="all 0.2s"
    >
      <Icon size="50px" />
      <Text fontSize="xl">{label}</Text>
    </Button>
  </Tooltip>
);

const StartPage = ({ onSelectDifficulty }) => {
  const difficulties = [
    { 
      id: 'easy', 
      label: 'Easy', 
      color: 'green',
      icon: FaChild,
      tooltip: 'Short, simple sentences'
    },
    { 
      id: 'medium', 
      label: 'Medium', 
      color: 'yellow',
      icon: FaRunning,
      tooltip: 'Moderate length, everyday vocabulary'
    },
    { 
      id: 'difficult', 
      label: 'Difficult', 
      color: 'orange',
      icon: FaBolt,
      tooltip: 'Complex sentences, advanced vocabulary'
    },
    { 
      id: 'very_difficult', 
      label: 'Very Difficult', 
      color: 'red',
      icon: FaFire,
      tooltip: 'Technical content, challenging phrases'
    }
  ];

  return (
    <Box 
      minH="100vh" 
      bg="gray.700" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <VStack spacing={8}>
        <Text 
          fontSize="6xl" 
          fontWeight="bold" 
          color="white"
          textAlign="center"
        >
          🗣️ SpeechRacer 🏎️
        </Text>
        <Text 
          fontSize="xl" 
          color="gray.300" 
          maxW="600px" 
          textAlign="center" 
          mb={8}
        >
          Challenge yourself to speak faster and more concisely! Select a difficulty to begin.
        </Text>
        <SimpleGrid columns={2} spacing={8}>
          {difficulties.map((diff) => (
            <DifficultyButton
              key={diff.id}
              icon={diff.icon}
              label={diff.label}
              color={diff.color}
              tooltip={diff.tooltip}
              onClick={() => onSelectDifficulty(diff.id)}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

DifficultyButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired
};

StartPage.propTypes = {
  onSelectDifficulty: PropTypes.func.isRequired
};

export default StartPage; 