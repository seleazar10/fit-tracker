'use script';

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');

console.log(months.map((el) => el[0]));

const success = function (position) {
	console.log(`this is the position`);
	console.log(position);
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	console.log(latitude, longitude);
	const mapLink = `https://www.google.com/maps/place/@${latitude},${longitude}`;
	console.log(mapLink);
	// getMapFromAPI(latitude, longitude);

	let map = L.map('map').setView([51.505, -0.09], 13);

	L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	L.marker([51.5, -0.09]).addTo(map).bindPopup('Current Location').openPopup();
};

const error = function (err) {
	console.warn(err.code, err.message);
};

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success, error);
} else {
	console.log(`the browser does not support geo location`);
}
