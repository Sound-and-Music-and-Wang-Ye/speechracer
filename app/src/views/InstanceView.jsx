import { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react'
import { getRandomQuoteJSON } from "../utils/randomQuote.js";
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import Navbar from '../Navbar';
import SettingsBar from '../SettingsBar';
import QuoteDisplay from '../components/QuoteDisplay';
import { onlyWords } from "../utils/onlyWords.js";

const quote = getRandomQuoteJSON();
const sentence = quote.text;
const words = sentence.split(' ');

const skipWords = (sentence, n) => {
	return sentence.split(' ').slice(n).join(' ');
}

function InstanceView() {
	const [progress, setProgress] = useState(0);
	const [errorList, setErrorList] = useState([]);

	const [transcriptProgress, setTranscriptProgress] = useState(0);
	const [isNextWordError, setIsNextWordError] = useState(false);

	const [timeoutDisplay, setTimeoutDisplay] = useState(5);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition
	} = useSpeechRecognition();

	const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-SG' })
	const stopListening = () => SpeechRecognition.stopListening()

	useEffect(() => {
		setTimeoutDisplay(5);
		const interval = setInterval(() => {
			setTimeoutDisplay((prev) => {
				if (prev <= 1) {
					setErrorList((prevErrorList) => [...prevErrorList, progress]);
					setProgress((prevProgress) => prevProgress + 1);
					return 5;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [progress]);


	useEffect(() => {
		const transcriptWords = onlyWords(transcript).split(' ').slice(transcriptProgress);
		const quoteWords = words.map(onlyWords).slice(progress);

		let matchCount = 0;
		let skip = 0;
		for (let i = 0; i < quoteWords.length; i++) {
			let found = false;
			for (let j = skip; j < transcriptWords.length; j++) {
				if (quoteWords[i] == transcriptWords[j]) {
					matchCount += 1;
					skip = j + 1;

					setTranscriptProgress(transcriptProgress + j + 1);

					found = true;
					break;
				}
			}

			if (!found) {
				setIsNextWordError(true);
				break;
			}
		}

		// Idk why this can't be in the for loop but it seems to only set
		// once per useEffect call, regardless of how many times I call
		// setProgress
		setProgress(progress + matchCount);



		// On win, activate modal
		if (progress + matchCount === words.length) {
			setIsModalOpen(true);
		}

	}, [transcript]);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn&#39;t support speech recognition.</span>
	}

	return (
		<>
			<Flex bg="gray.700" direction="column" minH="100vh">
				<Box px={4} h={'11vh'}>
					<Navbar />
				</Box>

				<Box px={4} h={'4vh'}>
					<SettingsBar />
				</Box>

				<Box
					px={64}
					display="flex"
					alignItems="center"
					flex="1"
				>
					<QuoteDisplay
						words={words}
						progress={progress}
						errorList={errorList}
						isNextWordError={isNextWordError}
						timeoutDisplay={timeoutDisplay}
						completedCallback={() => setIsPopoverOpen(true)}
					/>
				</Box>

				<div>
					<Text color="white">Transcript: {
						transcript
					}</Text>
					<Text color="white">Progress: {progress}</Text>
				</div>

				<Flex px={64} h={'4vh'} justify="flex-end">
					<ButtonGroup variant='solid' spacing='6'>
						<Button colorScheme='green' onClick={startListening}>Start Recording</Button>
						<Button colorScheme='red' onClick={stopListening}>Stop Recording</Button>
					</ButtonGroup>
				</Flex>


				<Box bg="gray.700" px={4} h={'15vh'} />


				<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Congrats!</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							You have successfully completed the quote.
						</ModalBody>

						<ModalFooter>
							<Button colorScheme='orange' onClick={() => setIsModalOpen(false)}>
								Close
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>


			</Flex>
		</>
	);
}

export default InstanceView;
