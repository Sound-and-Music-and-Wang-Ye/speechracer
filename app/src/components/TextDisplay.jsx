import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const TextDisplay = ({ words, progress }) => {
    return (
        <Box
            display="flex"
            flexWrap="wrap"
            w="100%"
        >
            {words.map((word, index) => (
                <Text key={index} fontSize="5xl" mr={2} mb={8}
                    color={index < progress ? "green.400" : "gray.400"}
                >
                    {word}
                </Text>
            ))}
        </Box>
    );
}

export default TextDisplay;
