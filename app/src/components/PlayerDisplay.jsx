import { Box, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SinglePlayerDisplay = ({ name }) => {
  return (
    <Box 
      bg="gray.700" 
      p={4} 
      rounded="lg"
      w="full"
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
      w="full"
      maxW="1200px"
      mx="auto"
    >
      <Text color="white" fontSize="lg" mb={4} fontWeight="bold">Players</Text>
      <Box 
        display="grid" 
        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" 
        gap={3}
      >
        {Object.keys(players).map((player) => (
          <SinglePlayerDisplay 
            key={player}
            name={player} 
          />
        ))}
      </Box>
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