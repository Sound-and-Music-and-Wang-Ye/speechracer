// import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { getRandomQuoteJSON } from "../utils/randomQuote.js";

import Navbar from '../Navbar';
import SettingsBar from '../SettingsBar';
import TextDisplay from '../components/TextDisplay';

const quote = getRandomQuoteJSON();
const sentence = quote.text;
const words = sentence.split(' ');

function InstanceView() {
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
          <TextDisplay words={words} progress={5} />
        </Box>

        <Box bg="gray.700" px={4} h={'15vh'} />
      </Flex>
    </>
  );
}

export default InstanceView;
