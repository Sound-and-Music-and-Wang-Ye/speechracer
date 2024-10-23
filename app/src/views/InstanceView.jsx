// import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import Navbar from '../Navbar';
import SettingsBar from '../SettingsBar';
import TextDisplay from '../components/TextDisplay';

import { useStore } from '../core/Instance';

function InstanceView() {
  const words = useStore((state) => state.words);
  const progress = useStore((state) => state.progress);
  const isWrongWord = useStore((state) => state.isWrongWord);

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
          <TextDisplay words={words} progress={progress} isWrongWord={isWrongWord} />
        </Box>

        <Box bg="gray.700" px={4} h={'15vh'} />
      </Flex>
    </>
  );
}

export default InstanceView;
