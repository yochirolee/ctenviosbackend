export default function isDate(date) {
	return Date.parse(date) ? date : null;
}
