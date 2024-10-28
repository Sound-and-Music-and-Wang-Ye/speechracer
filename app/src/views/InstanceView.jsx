import { useState, useEffect} from 'react';
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
import { getRandomQuoteDifficulty } from "../utils/randomQuote.js";
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import useWebSocket from 'react-use-websocket';

import Navbar from '../Navbar';
import SettingsBar from '../SettingsBar';
import QuoteDisplay from '../components/QuoteDisplay';
import { onlyWords } from "../utils/onlyWords.js";
import PlayerDisplay from '../components/PlayerDisplay.jsx';
import Swal from 'sweetalert2';

const BACKEND = import.meta.env.VITE_BACKEND;

const randomNumberBetween1And100 = Math.floor(Math.random() * 100) + 1;
const WS_URL = `${BACKEND}/ws/lobby/${randomNumberBetween1And100}`;

function InstanceView() {
	const [words, setWords] = useState([]);
	const [players, setPlayers] = useState({});
	const [gameState, setGameState] = useState("joined");
	const [progress, setProgress] = useState(0);
	const [errorList, setErrorList] = useState([]);
	const [difficulty, setDifficulty] = useState("easy");

	const [transcriptProgress, setTranscriptProgress] = useState(0);
	const [isNextWordError, setIsNextWordError] = useState(false);
	const [timeoutDisplay, setTimeoutDisplay] = useState(5);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL, {
		onOpen: () => {
      console.log('WebSocket connection established.');
    },
		share: true
	});

	useEffect(() => {
		if (!lastMessage) return;
		const message = JSON.parse(lastMessage.data);
		const method = message.method;

		if (message.players) setPlayers(message.players);
		if (method === "connect") {
			const timeRemaining = message.time_remaining;
			let timerInterval;
			Swal.fire({
				title: "Waiting for players...",
				html: "Game begins in <b></b> seconds.",
				timer: timeRemaining * 1000,
				timerProgressBar: true,
				didOpen: () => {
					Swal.showLoading();
					const timer = Swal.getPopup().querySelector("b");
					timerInterval = setInterval(() => {
						timer.textContent = `${Math.floor(Swal.getTimerLeft() / 1000)}`;
					}, 100);
				},
				willClose: () => {
					clearInterval(timerInterval);
				}
			})
		}
		if (method === "start") {
			const text = message.text;
			setWords(text.split(' '));
			setGameState("started");
			startListening();
			resetGame();
		}
		if (method === "end") {
			stopListening();
			setGameState("ended");
		}
	}, [lastMessage]);

	const {
		transcript,
		browserSupportsSpeechRecognition
	} = useSpeechRecognition();

	const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-SG' })
	const stopListening = () => SpeechRecognition.stopListening()

	const resetGame = () => {
		setProgress(0);
		setErrorList([]);
		setTranscriptProgress(0);
		setIsNextWordError(false);
		setIsModalOpen(false);
	}

	useEffect(() => {
		async function fetchQuote() {
			const fetchedQuote = await getRandomQuoteDifficulty(difficulty);
			setWords(fetchedQuote.split(' '));
		}
		fetchQuote();

		// TODO: Make this while loop with async
		if (words.length > 100) {
			fetchQuote()
		}
		resetGame()
	}, [difficulty]);


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
				if (quoteWords[i] === transcriptWords[j]) {
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
		if (progress + matchCount === words.length && words.length > 0) {
			setIsModalOpen(true);
		}

	}, [transcript]);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn&#39;t support speech recognition.</span>
	}

	return (
		<>
			{Object.entries(players).map(([player, progress]) => (
				<PlayerDisplay name={player} progress={progress} />
			))}
			<Flex bg="gray.700" direction="column" minH="100vh">
				<Box px={4} h={'11vh'}>
					<Navbar />
				</Box>

				<Box px={4} h={'4vh'}>
					<SettingsBar difficulty={difficulty} changeDifficulty={setDifficulty}/>
				</Box>

				<Box
					px={64}
					display="flex"
					alignItems="center"
					flex="1"
				>
					{/*chunyu to jingwen: what is setIsPopoverOpen? Eslint is giving me an error here.*/}
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
