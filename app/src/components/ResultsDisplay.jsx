import { Box, Text, VStack, HStack, Progress, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ResultsDisplay = ({ 
  words, 
  errorList, 
  timeTaken, 
  accuracy,
  wpm,
  onPlayAgain 
}) => {
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
  onPlayAgain: PropTypes.func.isRequired
};

export default ResultsDisplay; 