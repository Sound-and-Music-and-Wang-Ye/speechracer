import { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import { Box, Flex, Text, Fade } from '@chakra-ui/react';
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import useWebSocket from 'react-use-websocket';

import Navbar from '../Navbar';
import QuoteDisplay from '../components/QuoteDisplay';
import { onlyWords } from "../utils/onlyWords.js";
import PlayerDisplay from '../components/PlayerDisplay.jsx';
import ResultsDisplay from '../components/ResultsDisplay.jsx';
import Swal from 'sweetalert2';

const BACKEND = import.meta.env.VITE_BACKEND;

const randomNumberBetween1And100 = Math.floor(Math.random() * 10000) + 1;
const name = `Player-${randomNumberBetween1And100}`;
const WS_URL = (difficulty) => `${BACKEND}/api/speechracer/${difficulty}/${name}`;

function InstanceView({ difficulty }) {
	const [words, setWords] = useState([]);
	const [source, setSource] = useState("");
	const [players, setPlayers] = useState({});
	const [gameState, setGameState] = useState("joined");
	const [progress, setProgress] = useState(0);
	const [errorList, setErrorList] = useState([]);

	const [transcriptProgress, setTranscriptProgress] = useState(0);
	const [isNextWordError, setIsNextWordError] = useState(false);
	const [timeoutDisplay, setTimeoutDisplay] = useState(1);

	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);

	const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL(difficulty), {
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
				allowOutsideClick: false,
				didOpen: () => {
					startListening();
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
			const source = message.source;
			setSource(source);
			setGameState("started");
			setStartTime(Date.now());
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
	}

	useEffect(() => {
		// Only run timeout logic if game has started and we have words
		if (gameState !== "started" || words.length === 0) return;

		setTimeoutDisplay(1);
		const interval = setInterval(() => {
			setTimeoutDisplay((prev) => {
				if (prev <= 1) {
					setErrorList((prevErrorList) => [...prevErrorList, progress]);
					setProgress((prevProgress) => {
						const newProgress = prevProgress + 1;
						if (newProgress >= words.length) {
							const endTime = Date.now();
							setEndTime(endTime);
							setGameState("results");
						}
						return newProgress;
					});
					return 1;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [progress, words.length, gameState]);


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

					const newProgress = transcriptProgress + j + 1

					setTranscriptProgress(newProgress);
					sendJsonMessage({ method: "progress", name, progress: newProgress });

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



		// On win, transition directly to results
		if (progress + matchCount === words.length && words.length > 0) {
			const endTime = Date.now();
			setEndTime(endTime);
			setGameState("results");
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
				<PlayerDisplay players={players} length={words.length} />

				{gameState === "started" && (
					<Fade in={true}>
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
							/>
						</Box>

						<div>
							<Text color="white">Transcript: {transcript}</Text>
							<Text color="white">Progress: {progress}</Text>
							<Text color="white">From: {source}</Text>
						</div>
					</Fade>
				)}

				{gameState === "results" && (
					<Fade in={true} transition={{ enter: { duration: 0.5 } }}>
						<Box px={8} py={12}>
							<ResultsDisplay
								words={words}
								errorList={errorList}
								timeTaken={endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0}
								accuracy={words.length > 0 ? Math.round(((words.length - errorList.length) / words.length) * 100) : 0}
								wpm={endTime && startTime && errorList.length < words.length ? 
									Math.round((words.length - errorList.length) / ((endTime - startTime) / 1000) * 60) : 0}
								onPlayAgain={() => window.location.reload()}
							/>
						</Box>
					</Fade>
				)}

				<Box bg="gray.700" px={4} h={'15vh'} />
			</Flex>
		</>
	);
}

InstanceView.propTypes = {
	difficulty: PropTypes.string.isRequired,
};

export default InstanceView;
