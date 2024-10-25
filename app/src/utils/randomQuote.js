import para from '../../paragraphs/para.json'
// import index from '../../lang-packs/index.json'
import index from '../../lang-packs/demo.json'

export const para_len = 6343;
export const lang_pack_len = 6724;

export async function getRandomQuoteDifficulty(difficulty) {
    let loc;
    let randomNumber;
    switch (difficulty) {
        case "easy": {
            const easy_index = 3135
            const easy_length = 35
            randomNumber = easy_index + Math.floor((Math.random() * easy_length));
            loc = index.list[randomNumber];
            break;
        }
        case "medium": {
            const medium_index = 3170
            const medium_length = 10
            randomNumber = medium_index + Math.floor((Math.random() * medium_length));
            loc = index.list[randomNumber];
            break;
        }
        case "difficult": {
            const difficult_index = 0
            const difficult_length = 10
            randomNumber = difficult_index + Math.floor((Math.random() * difficult_length));
            loc = index.list[randomNumber];
            break;
        }
        case "very_difficult": {
            const very_difficult_index = 6435
            const very_difficult_length = 10
            randomNumber = very_difficult_index + Math.floor((Math.random() * very_difficult_length));
            loc = index.list[randomNumber];
            break;
        }
    }
    // console.log(loc);
    const url = `https://corsproxy.io/?https://gitlab.com/ttyperacer/lang-packs/-/raw/master/${loc}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Network response was not ok');
            return null;
        }
        const fileContent = await response.text();
        return fileContent.split('\n')[0];
    } catch (error) {
        console.error('Failed to fetch the quote:', error);
        return null;
    }

}

export function getRandomQuoteJSON() {
    const randomNumber = Math.floor((Math.random() * para_len));
    return para.quotes[randomNumber];
}

export function getRandomQuote() {
    const randomNumber = Math.floor((Math.random() * para_len));
    return para.quotes[randomNumber].text;
}