import para from '../../paragraphs/para.json'

export function randomNumQuote() {
	const randomNumber = Math.floor((Math.random() * para.length));
	let quote = para[randomNumber].para;
	if (quote.length < 100) {
		quote = para[randomNumber].para + " " + para[randomNumber - 1].para;
	}
	return quote;
}