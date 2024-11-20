import { Box, Text, VStack, HStack, Progress, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const calculateScore = (wpm, accuracy, timeTaken) => {
  if (wpm === 0 || accuracy === 0) return 0;
  const baseScore = wpm * 10;
  const accuracyMultiplier = accuracy / 100;
  const timeBonus = Math.max(0, (300 - timeTaken)) * 2;
  return Math.round((baseScore + timeBonus) * accuracyMultiplier);
};

const ResultsDisplay = ({ wpm, accuracy, timeTaken, source }) => {
  const score = calculateScore(wpm, accuracy, timeTaken);

  return (
    <VStack spacing={6} p={8} bg="gray.800" rounded="xl" maxW="600px" mx="auto">
      <Text fontSize="2xl" color="yellow.400">Final Results</Text>
      
      <VStack spacing={4} w="full">
        <Box w="full">
          <HStack justify="space-between">
            <Text color="white">Words per Minute</Text>
            <Text color="green.400" fontWeight="bold">{wpm}</Text>
          </HStack>
          <Progress value={Math.min(wpm, 200)} max={200} colorScheme="green" />
        </Box>

        <Box w="full">
          <HStack justify="space-between">
            <Text color="white">Accuracy</Text>
            <Text color="blue.400" fontWeight="bold">{accuracy}%</Text>
          </HStack>
          <Progress value={accuracy} colorScheme="blue" />
        </Box>

        <Box w="full">
          <HStack justify="space-between">
            <Text color="white">Time Taken</Text>
            <Text color="purple.400" fontWeight="bold">{timeTaken}s</Text>
          </HStack>
        </Box>

        <Box w="full">
          <HStack justify="space-between">
            <Text color="white">Final Score</Text>
            <Text color="yellow.400" fontSize="xl" fontWeight="bold">{score}</Text>
          </HStack>
        </Box>

        {source && (
          <Box w="full" mt={4} p={4} bg="gray.700" rounded="md">
            <Text color="gray.300" fontSize="sm">Source: {source}</Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
};

ResultsDisplay.propTypes = {
  wpm: PropTypes.number.isRequired,
  accuracy: PropTypes.number.isRequired,
  timeTaken: PropTypes.number.isRequired,
  source: PropTypes.string,
};

export default ResultsDisplay; 