import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SinglePlayerDisplay = ({ name }) => {
  return (
    <Box 
      bg="gray.700" 
      p={4} 
      rounded="lg" 
      w="full"
      maxW="300px"
      shadow="md"
    >
      <Text color="white" fontWeight="bold">{name}</Text>
    </Box>
  );
};

const PlayerDisplay = ({ players }) => {
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
        {Object.keys(players).map((player) => (
          <SinglePlayerDisplay 
            key={player}
            name={player} 
          />
        ))}
      </VStack>
    </Box>
  );
};

SinglePlayerDisplay.propTypes = {
  name: PropTypes.string.isRequired,
};

PlayerDisplay.propTypes = {
  players: PropTypes.object.isRequired,
};

export default PlayerDisplay;