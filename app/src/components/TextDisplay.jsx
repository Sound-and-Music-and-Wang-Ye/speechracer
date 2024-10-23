// import { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

const TextDisplay = ({ 
    words, progress, 
    makeNextWordRed=false, 
    makeRedIndices=[],
 }) => {
    const fontSize = words.length > 50 ? "3xl" : "5xl";
    return (
        <Box
            display="flex"
            flexWrap="wrap"
            w="100%"
        >
            {words.map((word, index) => (
                <Text key={index} fontSize={fontSize} mr={2} mb={8}
                    color={
                        (makeNextWordRed && index == progress) || makeRedIndices.includes(index) 
                            ? "red.400" 
                            : index < progress 
                                ? "green.400" 
                                : "gray.400"}
                >
                    {word}
                </Text>
            ))}
        </Box>
    );
}

export default TextDisplay;
