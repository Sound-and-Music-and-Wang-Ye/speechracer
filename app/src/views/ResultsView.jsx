import { Box, Text, VStack, HStack, Progress, Button, Fade, Flex } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const calculateScore = (wpm, accuracy, timeTaken) => {
  if (wpm === 0 || accuracy === 0) return 0;
  const baseScore = wpm * 10;
  const accuracyMultiplier = accuracy / 100;
  const timeBonus = Math.max(0, (300 - timeTaken)) * 2;
  return Math.round((baseScore + timeBonus) * accuracyMultiplier);
};

const ResultsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    words = [], 
    errorList = [], 
    timeTaken = 0, 
    accuracy = 0, 
    wpm = 0, 
    source = '' 
  } = location.state || {};

  // Redirect to home if accessed directly without state
  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handlePlayAgain = () => {
    navigate('/');
  };

  const score = calculateScore(wpm, accuracy, timeTaken);
  
  return (
    <Flex 
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.900"
      py={8}
      w="full"
    >
      <Fade in={true} transition={{ enter: { duration: 0.5 } }} style={{ width: '100%' }}>
        <Box
          bg="gray.800"
          p={8}
          rounded="xl"
          w="full"
          maxW="800px"
          mx="auto"
          color="white"
          boxShadow="xl"
        >
          <VStack spacing={6} align="stretch" w="full">
            <Text fontSize="3xl" textAlign="center" color="yellow.400">
              Race Results
            </Text>

            <Text fontSize="5xl" textAlign="center" color="purple.400">
              Score: {score}
            </Text>

            <HStack justify="space-between" w="full">
              <VStack align="start" flex={1}>
                <Text fontSize="lg">Words Per Minute</Text>
                <Text fontSize="4xl" color="green.400">{wpm}</Text>
              </VStack>
              
              <VStack align="start" flex={1}>
                <Text fontSize="lg">Accuracy</Text>
                <Text fontSize="4xl" color="blue.400">{accuracy}%</Text>
              </VStack>

              <VStack align="start" flex={1}>
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
              onClick={handlePlayAgain}
            >
              Play Again
            </Button>
          </VStack>
        </Box>
      </Fade>
    </Flex>
  );
};

export default ResultsView; 