import { useState, useEffect} from 'react';
import { Box, Flex, Text, Fade } from '@chakra-ui/react';
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import useWebSocket from 'react-use-websocket';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar.jsx';
import QuoteDisplay from '../components/QuoteDisplay';
import { onlyWords } from "../utils/onlyWords.js";
import PlayerDisplay from '../components/PlayerDisplay.jsx';
import Swal from 'sweetalert2';
import ProgressStats from '../components/ProgressStats';
import SettingsModal from '../components/SettingsModal';

const BACKEND = 'https://speechracer-server.jwen.cc';

const randomNumberBetween1And100 = Math.floor(Math.random() * 10000) + 1;
const name = `Player-${randomNumberBetween1And100}`;
const WS_URL = (difficulty) => `${BACKEND}/api/speechracer/${difficulty}/${name}`;

function InstanceView() {
	const { difficulty } = useParams();
	const navigate = useNavigate();

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

	const [wsUrl, setWsUrl] = useState(WS_URL(difficulty));

	const [settings, setSettings] = useState(() => {
		const savedSettings = localStorage.getItem('speechRacerSettings');
		return savedSettings ? JSON.parse(savedSettings) : {
			wordTimeout: 3,
			showTranscript: true
		};
	});
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	useEffect(() => {
		setWsUrl(WS_URL(difficulty));
	}, [difficulty]);

	const { sendJsonMessage, lastMessage } = useWebSocket(wsUrl, {
		onOpen: () => {
      console.log('WebSocket connection established.');
    },
		share: true,
		shouldReconnect: () => false
	});

	useEffect(() => {
		return () => {
			Swal.close();
			SpeechRecognition.stopListening();
		};
	}, []);
	
	useEffect(() => {
		if (!lastMessage) return;
		const message = JSON.parse(lastMessage.data);
		const method = message.method;

		if (message.players) {
			// console.log("Players Received. Players:", message.players);
			const validPlayers = Object.fromEntries(
				Object.entries(message.players).filter(([key, value]) => key && value !== undefined)
			);
			console.log("Valid Players:", validPlayers);
			setPlayers(validPlayers);
		}
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
		if (method === "progress") {
			const { name, progress } = message;
			
			setPlayers(prevPlayers => {
				// Only update if the player exists
				// Hacky check: otherwise player list will be populated with undefined
				if (!name || !prevPlayers[name]) {
					return prevPlayers;
				}
				
				return {
					...prevPlayers,
					[name]: { ...prevPlayers[name], progress }
				};
			});
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

	const timeoutResolution = 20; // 100ms
	useEffect(() => {
		// Only run timeout logic if game has started and we have words
		if (gameState !== "started" || words.length === 0) return;

		setTimeoutDisplay(settings.wordTimeout * timeoutResolution);
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
		}, 1000 / timeoutResolution);

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
		sendJsonMessage({ method: "progress", name, progress: progress + matchCount });



		// On win, transition directly to results
		if (progress + matchCount === words.length && words.length > 0) {
			const endTime = Date.now();
			stopListening();
			setEndTime(endTime);
			setGameState("results");
			
			// Calculate stats
			const accuracy = Math.round(((words.length - errorList.length) / words.length) * 100);
			const wpm = Math.round((words.length - errorList.length) / ((endTime - startTime) / 1000) * 60);
			
			if (name) {
				sendJsonMessage({
					method: "complete",
					name,
					accuracy,
					wpm
				});
		}
		}

	}, [transcript]);

	// Add this effect to save settings when they change
	useEffect(() => {
		localStorage.setItem('speechRacerSettings', JSON.stringify(settings));
	}, [settings]);

	// Add this useEffect near your other effects
	useEffect(() => {
		if (gameState === "results") {
			navigate('/results', { 
				state: { 
					words,
					errorList,
					timeTaken: endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0,
					accuracy: words.length > 0 ? Math.round(((words.length - errorList.length) / words.length) * 100) : 0,
					wpm: endTime && startTime && errorList.length < words.length ? 
						Math.round((words.length - errorList.length) / ((endTime - startTime) / 1000) * 60) : 0,
					source
				} 
			});
		}
	}, [gameState]);

	const sendCompletion = (accuracy, wpm) => {
		sendJsonMessage({
			method: "complete",
			name,
			accuracy,
			wpm
		});
	};

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn&#39;t support speech recognition.</span>
	}

	return (
		<Flex direction="column" h="100vh">
			{settings.showTranscript && (
				<Box 
					position="fixed" 
					bottom="20px"
					right="20px"
					bg="black" 
					color="white" 
					p={2} 
					zIndex="9998"
					maxW="300px"
					maxH="150px"
					overflow="auto"
					borderRadius="md"
					boxShadow="lg"
				>
					<Text fontSize="sm">Transcript: {transcript || 'No transcript'}</Text>
				</Box>
			)}

			<Flex bg="gray.700" direction="column" minH="100vh">
				<Box 
					px={4} 
					h={'11vh'} 
					position="relative" 
					zIndex="9999"
				>
					<Navbar onOpenSettings={() => setIsSettingsOpen(true)} onClickLogo={() => navigate('/')} />
					<SettingsModal
						isOpen={isSettingsOpen}
						onClose={() => setIsSettingsOpen(false)}
						settings={settings}
						onSettingsChange={setSettings}
					/>
				</Box>

				{gameState === "started" && (
					<Fade in={true}>
						<Flex 
							px={[4, 8, 16, 32]}
							py={4} 
							direction={['column', 'column', 'row']}
							gap={4}
						>
							<Box flex={['1', '1', '1']}>
								<PlayerDisplay players={players} />
							</Box>
							<Box flex={['1', '1', '2']}>
								<ProgressStats 
									words={words}
									players={players}
									startTime={startTime}
									currentPlayerName={name}
								/>
							</Box>
						</Flex>
						<Box
							px={[4, 16, 32, 64]}
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
									maxTimeout={settings.wordTimeout * timeoutResolution}
								/>
						</Box>
					</Fade>
				)}

				<Box bg="gray.700" px={4} h={'15vh'} />
			</Flex>
		</Flex>
	);
}

export default InstanceView;
