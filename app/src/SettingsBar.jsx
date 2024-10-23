import React from 'react';
import { Box, Button, Flex, Text, Input, InputLeftElement } from '@chakra-ui/react';

import { useStore, startInstance, attemptWord, wordsLeft } from './core/Instance';

const SettingsBar = () => {
    const [debugWord, setDebugWord] = React.useState('');
    return (
        <>
            <Flex alignItems="center" justifyContent="center" h="100%">
                <Box
                    bg="gray.800"
                    px={4}
                    w="1100px"
                    h="100%"
                    rounded="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.400"
                    gap={4}
                >
                    <Button
                        onClick={startInstance}
                    >
                        startInstance
                    </Button>
                    <Button
                        onClick={() => { attemptWord(debugWord); setDebugWord(''); }}
                    >
                        attemptWord
                    </Button>

                    <Input
                        type="text"
                        placeholder="Enter word"
                        value={debugWord}
                        onChange={(e) => setDebugWord(e.target.value)}
                    />

                </Box>
            </Flex>
        </>

    );
};

export default SettingsBar;