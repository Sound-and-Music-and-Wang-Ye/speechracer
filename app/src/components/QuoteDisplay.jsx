import { Box, Text, Progress  } from '@chakra-ui/react';
import PropTypes from "prop-types";

const QuoteDisplay = ({
    words, progress, errorList, isNextWordError, timeoutDisplay, maxTimeout,
}) => {
    const fontSize = words.length > 50 ? "3xl" : "5xl";

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            w="100%"
        >
            {words.map((word, index) => {
                return (
                    <Box key={index}>
                        <Text fontSize={fontSize} mr={2} mt={8}
                            color={
                                isNextWordError && index === progress
                                    ? "orange.400"
                                    : errorList.includes(index)
                                        ? "red.400"
                                        : index < progress
                                            ? "green.400"
                                            : "gray.400"}
                        >
                            {word}
                        </Text>
                        {index === progress && <Progress value={timeoutDisplay} max={maxTimeout} colorScheme='orange' size='xs' mr={4}/> }
                    </Box>)
            }
            )}
        </Box>
    );
}

QuoteDisplay.propTypes = {
    words: PropTypes.arrayOf(PropTypes.string).isRequired,
    progress: PropTypes.number.isRequired,
    errorList: PropTypes.arrayOf(PropTypes.number).isRequired,
    isNextWordError: PropTypes.bool.isRequired,
    timeoutDisplay: PropTypes.number.isRequired,
};

export default QuoteDisplay;
