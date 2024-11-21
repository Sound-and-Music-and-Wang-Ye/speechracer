import React from 'react';
import { Box, Flex, Heading, IconButton, Image } from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import logo from '../assets/logo.svg';

const Navbar = ({ onOpenSettings, onClickLogo }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <Flex justify="space-between" align="center" w="100%" p={4}>
            <Image
                src={logo}
                alt="SpeechRacer"
                width={250} 
                p={4}
                onClick={onClickLogo}
                cursor="pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transition: 'all 0.2s ease-in-out',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                }}
            />
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