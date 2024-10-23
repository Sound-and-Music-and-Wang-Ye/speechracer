import { create } from 'zustand';
import { getRandomQuoteJSON } from '../utils/randomQuote';

export const useStore = create((set) => ({
    progress: 0,
    setProgress: (progress) => set({ progress }),

    words: [],
    setWords: (words) => set({ words }),

    isWrongWord: false,
}));

export const startInstance = () => {
    const quote = getRandomQuoteJSON();
    const sentence = quote.text;
    const words = sentence.split(' ');
    useStore.setState({ words });
    useStore.setState({ progress: 0 });
};

export const attemptWord = (word) => {
    const { words, progress } = useStore.getState();
    if (word === words[progress]) {
        useStore.setState({ progress: progress + 1 });
    }

    useStore.setState({ isWrongWord: word !== words[progress] });

    return word === words[progress];
}

export const wordsLeft = () => {
    const { words, progress } = useStore.getState();
    return words.length - progress;
}
