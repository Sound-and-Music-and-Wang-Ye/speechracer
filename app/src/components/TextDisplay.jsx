// import { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

const TextDisplay = ({ words, progress, isWrongWord }) => {
    const fontSize = words.length > 50 ? "3xl" : "5xl";
    return (
        <Box
            display="flex"
            flexWrap="wrap"
            w="100%"
        >
            {words.map((word, index) => {
                const color = index === progress && isWrongWord
                    ? "red.400"
                    : index < progress
                        ? "green.400"
                        : "gray.400";

                return (
                    <Text key={index} fontSize={fontSize} mr={2} mb={8}
                        color={color}
                    >
                        {word}
                    </Text>
                )
            })}
        </Box>
    );
}

export default TextDisplay;
