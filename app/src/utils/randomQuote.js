import para from '../../paragraphs/para.json'

export const para_len = 6343;
export function getRandomQuoteJSON() {
	const randomNumber = Math.floor((Math.random() * para_len));
	return para.quotes[randomNumber];
}

export function getRandomQuote() {
	const randomNumber = Math.floor((Math.random() * para_len));
	return para.quotes[randomNumber].text;
}