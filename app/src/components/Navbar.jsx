import React from 'react';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';

const Navbar = ({ onOpenSettings }) => {
    return (
        <Flex justify="space-between" align="center" w="100%">
            <Heading color="yellow.400">SpeechRacer</Heading>
            <IconButton
                icon={<FaCog />}
                aria-label="Settings"
                onClick={onOpenSettings}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
            />
        </Flex>
    );
};

export default Navbar;