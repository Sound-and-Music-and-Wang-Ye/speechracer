import PropTypes from "prop-types";
import {Box, Button, ButtonGroup, Flex} from '@chakra-ui/react';

const SettingsBar = ({
                         difficulty,
                         changeDifficulty
                     }) => {
    return (
        <>
            <Flex alignItems="center" justifyContent="center" h="100%">
                <Box
                    bg="gray.800"
                    px={4}
                    py={4}
                    w="1100px"
                    h="7vh"
                    rounded="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <ButtonGroup variant="outline" spacing="6">
                        <Button variant={difficulty === 'easy' ? 'solid' : 'outline'}
                                onClick={() => changeDifficulty('easy')} colorScheme="green">Easy</Button>
                        <Button variant={difficulty === 'medium' ? 'solid' : 'outline'}
                                onClick={() => changeDifficulty('medium')} colorScheme="yellow">Medium</Button>
                        <Button variant={difficulty === 'difficult' ? 'solid' : 'outline'}
                                onClick={() => changeDifficulty('difficult')} colorScheme="orange">Difficult</Button>
                        <Button variant={difficulty === 'very_difficult' ? 'solid' : 'outline'}
                                onClick={() => changeDifficulty('very_difficult')} colorScheme="red">Very
                            Difficult</Button>
                    </ButtonGroup>
                </Box>
            </Flex>
        </>

    );
};

SettingsBar.propTypes = {
    difficulty: PropTypes.string.isRequired,
    changeDifficulty: PropTypes.func.isRequired,
}

export default SettingsBar;