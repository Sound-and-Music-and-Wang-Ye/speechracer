import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import Navbar from './Navbar';
import SettingsBar from './SettingsBar';

const sentence = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
  + "ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi"
  + "ut aliquip ex ea commodo consequat.";
const words = sentence.split(' ');

function App() {
  return (
    <>
      <Flex bg="gray.700" direction="column" minH="100vh">
        <Box px={4} h={'11vh'}>
          <Navbar />
        </Box>

        <Box px={4} h={'4vh'}>
          <SettingsBar />
        </Box>

        <Box
          px={64}
          display="flex"
          alignItems="center"
          flex="1"
        >
          <Box 
            display="flex" 
            flexWrap="wrap" 
            color="gray.300" 
            w="100%"
          >
            {words.map((word, index) => (
              <Text key={index} fontSize="5xl" mr={2} mb={8}>
                {word}
              </Text>
            ))}
          </Box>
        </Box>

        <Box bg="gray.700" px={4} h={'15vh'} />
      </Flex>
    </>
  );
}

export default App;
