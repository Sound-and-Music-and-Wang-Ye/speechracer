import { Box, Text, VStack, HStack, Progress } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SinglePlayerDisplay = ({ name, progress, total }) => {
  const progressPercentage = (progress / total) * 100;
  
  return (
    <Box 
      bg="gray.700" 
      p={4} 
      rounded="lg" 
      w="full"
      maxW="300px"
      shadow="md"
    >
      <VStack spacing={2} align="stretch">
        <HStack justify="space-between">
          <Text color="white" fontWeight="bold">{name}</Text>
          <Text color="gray.300" fontSize="sm">{progress}/{total}</Text>
        </HStack>
        <Progress 
          value={progressPercentage} 
          size="sm" 
          colorScheme="green" 
          rounded="full"
        />
      </VStack>
    </Box>
  );
};

const PlayerDisplay = ({ players, length }) => {
  return (
    <Box 
      p={4} 
      bg="gray.800" 
      rounded="xl"
      maxW="800px"
      mx="auto"
    >
      <Text color="white" fontSize="lg" mb={4} fontWeight="bold">Players</Text>
      <VStack spacing={3} align="stretch">
        {Object.entries(players).map(([player, progress]) => (
          <SinglePlayerDisplay 
            key={player}
            name={player} 
            progress={progress} 
            total={length} 
          />
        ))}
      </VStack>
    </Box>
  );
};

SinglePlayerDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

PlayerDisplay.propTypes = {
  players: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
};

export default PlayerDisplay;