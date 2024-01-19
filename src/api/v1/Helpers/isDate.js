export default function isDate(date) {
	const regex = /(\d{4})-(\d{2})-(\d{2})/;
	console.log(Date.parse(date) && regex.test(date) ? date : null);
	return Date.parse(date) ? date : null;
}
