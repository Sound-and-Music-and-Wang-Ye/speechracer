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

const TIMEOUT = 5000;
const quote = getRandomQuoteJSON();
const sentence = quote.text;
const words = sentence.split(' ');

function scoreTranscriptWithTranscript(wordList, transcript, errorList) {
	const transcriptList = transcript.split(' ');
	return scoreTranscript(wordList, transcriptList, errorList);
}

function scoreTranscript(wordList, transcriptList, errorList) {
	let progress = 0;
	let transcriptPtr = 0;
	while (progress < wordList.length && transcriptPtr < transcriptList.length) {
		if (errorList.includes(progress)) {
			progress++;
			continue
		}
		if (onlyWords(wordList[progress]) === onlyWords(transcriptList[transcriptPtr])) {
			progress++;
		}
		transcriptPtr++;
	}
	return progress;
}

function InstanceView() {
	// To think about: Maybe pass in current progress so there's no need to recalculate
	const [progress, setProgress] = useState(0);
	const [timeoutId, setTimeoutId] = useState(null);
	const [errorList, setErrorList] = useState([]);

	const {transcript, browserSupportsSpeechRecognition} = useSpeechRecognition()

	const startListening = () => SpeechRecognition.startListening({continuous: true, language: 'en-SG'})
	const stopListening = () => SpeechRecognition.stopListening()

	useEffect(() => {
		setProgress(scoreTranscriptWithTranscript(words, transcript, errorList));

		// Create a timeout when the user can't get the word right
		// Only do this if transcript has started
		if (transcript.length !== 0) {
			const id = setTimeout(() => {
				setProgress(progress + 1)
				setErrorList([...errorList, progress])
			}, TIMEOUT);
			setTimeoutId(id);
		}

	}, [progress, transcript]);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn&#39;t support speech recognition.</span>
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
					 <TextDisplay words={words} progress={progress} errorList={errorList}/>
				 </Box>

				 <div>
					 <Text color="white">Transcript: {transcript}</Text>
					 <Text color="white">Progress: {progress}</Text>
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
