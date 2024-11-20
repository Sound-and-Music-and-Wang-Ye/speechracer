import { Box, Text, VStack, HStack, Progress, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const calculateScore = (wpm, accuracy, timeTaken) => {
  if (wpm === 0 || accuracy === 0) return 0;
  const baseScore = wpm * 10;
  const accuracyMultiplier = accuracy / 100;
  const timeBonus = Math.max(0, (300 - timeTaken)) * 2;
  return Math.round((baseScore + timeBonus) * accuracyMultiplier);
};

const ResultsDisplay = ({ 
  words, 
  errorList, 
  timeTaken, 
  accuracy,
  wpm,
  source,
  onPlayAgain 
}) => {
  const score = calculateScore(wpm, accuracy, timeTaken);
  
  return (
    <Box
      bg="gray.800"
      p={8}
      rounded="xl"
      w="full"
      maxW="800px"
      mx="auto"
      color="white"
    >
      <VStack spacing={6} align="stretch">
        <Text fontSize="3xl" textAlign="center" color="yellow.400">
          Race Results
        </Text>

        <Text fontSize="5xl" textAlign="center" color="purple.400">
          Score: {score}
        </Text>

        <HStack justify="space-between">
          <VStack align="start">
            <Text fontSize="lg">Words Per Minute</Text>
            <Text fontSize="4xl" color="green.400">{wpm}</Text>
          </VStack>
          
          <VStack align="start">
            <Text fontSize="lg">Accuracy</Text>
            <Text fontSize="4xl" color="blue.400">{accuracy}%</Text>
          </VStack>

          <VStack align="start">
            <Text fontSize="lg">Time</Text>
            <Text fontSize="4xl" color="purple.400">{timeTaken}s</Text>
          </VStack>
        </HStack>

        <Box>
          <Text mb={2}>Accuracy Meter</Text>
          <Progress 
            value={accuracy} 
            colorScheme={accuracy > 90 ? 'green' : accuracy > 70 ? 'yellow' : 'red'} 
            size="lg" 
            rounded="md"
          />
        </Box>

        <Box>
          <Text mb={2}>Mistakes: {errorList.length}</Text>
          <Text fontSize="sm" color="gray.400">
            Total Words: {words.length}
          </Text>
        </Box>

        {source && (
          <Box 
            bg="gray.700" 
            p={4} 
            rounded="md"
            borderLeft="4px"
            borderColor="yellow.400"
          >
            <Text fontSize="sm" color="gray.300">Source</Text>
            <Text>{source}</Text>
          </Box>
        )}

        <Button
          colorScheme="yellow"
          size="lg"
          onClick={onPlayAgain}
        >
          Play Again
        </Button>
      </VStack>
    </Box>
  );
};

ResultsDisplay.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  errorList: PropTypes.arrayOf(PropTypes.number).isRequired,
  timeTaken: PropTypes.number.isRequired,
  accuracy: PropTypes.number.isRequired,
  wpm: PropTypes.number.isRequired,
  source: PropTypes.string,
  onPlayAgain: PropTypes.func.isRequired
};

export default ResultsDisplay; 