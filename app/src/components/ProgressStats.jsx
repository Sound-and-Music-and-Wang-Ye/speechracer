import { Box, Text, Progress, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ProgressStats = ({ words, players, startTime, currentPlayerName }) => {
  const calculateWPM = (progress) => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // Convert to minutes
    const wpm = Math.round(progress / timeElapsed);
    return isNaN(wpm) ? 0 : wpm;  // Return 0 if calculation results in NaN
  };

  // Sort players to put current player first
  const sortedPlayers = Object.entries(players).sort(([name1], [name2]) => {
    if (name1 === currentPlayerName) return -1;
    if (name2 === currentPlayerName) return 1;
    return 0;
  });

  return (
    <VStack spacing={4} w="full">
      {sortedPlayers.map(([playerName, progress]) => (
        <Box key={playerName} w="full">
          <Text color="white" mb={2}>
            {playerName === currentPlayerName ? "You" : playerName}
            {' - '}
            {calculateWPM(progress)} WPM
          </Text>
          <Progress
            value={((progress || 0) / words.length) * 100}
            colorScheme={playerName === currentPlayerName ? "yellow" : "green"}
            size="sm"
            rounded="full"
          />
          {/* {console.log(`Progress bar value for ${playerName}:`, ((progress || 0) / words.length) * 100)} */}
        </Box>
      ))}
    </VStack>
  );
};

ProgressStats.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  players: PropTypes.object.isRequired,
  startTime: PropTypes.number,
  currentPlayerName: PropTypes.string.isRequired
};

export default ProgressStats; 