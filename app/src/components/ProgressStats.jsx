import { Box, Progress, Text, VStack, HStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ProgressStats = ({ words, players, startTime }) => {
  console.log('Players:', players);

  const calculateWPM = (progress) => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // Convert to minutes
    const wpm = Math.round(progress / timeElapsed);
    return isNaN(wpm) ? 0 : wpm;  // Return 0 if calculation results in NaN
  };

  return (
    <Box bg="gray.800" p={4} rounded="xl" w="full" maxW="800px" mx="auto">
      <VStack spacing={4} align="stretch">
        {Object.entries(players).map(([playerName, progress]) => {
          console.log(`Player: ${playerName}, Progress: ${progress}, Words Length: ${words.length}`);
          return (
            <Box key={playerName}>
              <HStack justify="space-between" mb={2}>
                <Text color="white">{playerName}</Text>
                <Text color="white">
                  {calculateWPM(progress)} WPM
                </Text>
              </HStack>
              <Progress 
                value={(progress / words.length) * 100} 
                colorScheme="green" 
                size="lg" 
                rounded="md"
              />
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

ProgressStats.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  players: PropTypes.object.isRequired,
  startTime: PropTypes.number
};

export default ProgressStats; 