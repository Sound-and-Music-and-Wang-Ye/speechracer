import { Box, Progress, Text, VStack, HStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ProgressStats = ({ words, progress, errorList }) => {
  const progressPercentage = (progress / words.length) * 100;
  const accuracy = words.length > 0 
    ? Math.round(((progress - errorList.length) / progress) * 100) || 100
    : 0;

  return (
    <Box bg="gray.800" p={4} rounded="xl" w="full" maxW="800px" mx="auto">
      <VStack spacing={4} align="stretch">
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text color="white">Progress</Text>
            <Text color="white">{Math.round(progressPercentage)}%</Text>
          </HStack>
          <Progress 
            value={progressPercentage} 
            colorScheme="green" 
            size="lg" 
            rounded="md"
          />
        </Box>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text color="white">Accuracy</Text>
            <Text color="white">{accuracy}%</Text>
          </HStack>
          <Progress 
            value={accuracy} 
            colorScheme={accuracy > 90 ? 'green' : accuracy > 70 ? 'yellow' : 'red'} 
            size="lg" 
            rounded="md"
          />
        </Box>
      </VStack>
    </Box>
  );
};

ProgressStats.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  progress: PropTypes.number.isRequired,
  errorList: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ProgressStats; 