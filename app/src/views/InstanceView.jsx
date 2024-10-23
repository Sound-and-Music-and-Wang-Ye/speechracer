import {useState, useEffect} from 'react';
import {Box, Flex, Text} from '@chakra-ui/react';
import {Button, ButtonGroup} from '@chakra-ui/react'
import {getRandomQuoteJSON} from "../utils/randomQuote.js";
import 'regenerator-runtime/runtime'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'

import Navbar from '../Navbar';
import SettingsBar from '../SettingsBar';
import TextDisplay from '../components/TextDisplay';
import {onlyWords} from "../utils/onlyWords.js";

const quote = getRandomQuoteJSON();
const sentence = quote.text;
const words = sentence.split(' ');
const BUFFER_SIZE = 30;

function InstanceView() {
	const [progress, setProgress] = useState(0);
	const [transcriptPtr, setTranscriptPtr] = useState(0);
	const {transcript, browserSupportsSpeechRecognition} = useSpeechRecognition()

	const startListening = () => SpeechRecognition.startListening({continuous: true, language: 'en-SG'})
	const stopListening = () => SpeechRecognition.stopListening()

	useEffect(() => {
		const parsedWord = onlyWords(words[progress]);
		const parsedTranscript = onlyWords(transcript.slice(Math.min(transcriptPtr - BUFFER_SIZE, 0)));
		if (parsedTranscript.includes(parsedWord)) {
			setProgress(progress + 1);
			setTranscriptPtr(transcript.length)
		}
	}, [transcript]);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>
	}

	return (
		 <>
			 <Flex bg="gray.700" direction="column" minH="100vh">
				 <Box px={4} h={'11vh'}>
					 <Navbar/>
				 </Box>

				 <Box px={4} h={'4vh'}>
					 <SettingsBar/>
				 </Box>

				 <Box
						px={64}
						display="flex"
						alignItems="center"
						flex="1"
				 >
					 <TextDisplay words={words} progress={progress}/>
				 </Box>

				 <div>
					 <Text color="white">Transcript: {transcript}</Text>
					 <Text color="white">Parsed Transcript: {onlyWords(transcript.slice(Math.min(transcriptPtr - 30, 0)))}</Text>
				 </div>

				 <Flex px={64} h={'4vh'} justify="flex-end">
					 <ButtonGroup variant='solid' spacing='6'>
						 <Button colorScheme='green' onClick={startListening}>Start Recording</Button>
						 <Button colorScheme='red' onClick={stopListening}>Stop Recording</Button>
					 </ButtonGroup>
				 </Flex>


				 <Box bg="gray.700" px={4} h={'15vh'}/>
			 </Flex>
		 </>
	);
}

export default InstanceView;
