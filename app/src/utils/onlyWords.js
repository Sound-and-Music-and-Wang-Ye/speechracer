export function onlyWords(str) {
	if (!str) return '';
	return str.toLowerCase().replace(/[^\w\s]/gi, '');
}