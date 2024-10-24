import { Box, Text } from '@chakra-ui/react';
import PropTypes from "prop-types";

const TextDisplay = ({ 
    words, progress, errorList,
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
                        (errorList.includes(index))
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

TextDisplay.propTypes = {
    words: PropTypes.arrayOf(PropTypes.string).isRequired,
    progress: PropTypes.number.isRequired,
    errorList: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TextDisplay;
