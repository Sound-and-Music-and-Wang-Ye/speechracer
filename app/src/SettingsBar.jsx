import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const SettingsBar = () => {
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
                >
                    <Text color="gray.400">Settings Bar</Text>
                </Box>
            </Flex>
        </>

    );
};

export default SettingsBar;