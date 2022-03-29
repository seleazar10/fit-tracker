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
const inputElevation = document.querySelector('.form__input--elevation');
const mapBox = document.getElementById('map');

console.log(months.map((el) => el[0]));

let map, e;

const success = function (position) {
	console.log(`this is the position`); //
	console.log(position); //

	const { latitude } = position.coords;
	const { longitude } = position.coords;
	const mapLink = `https://www.google.com/maps/place/@${latitude},${longitude}`;
	const coords = [latitude, longitude];

	console.log(coords);

	map = L.map('map').setView(coords, 13);
	console.log(map);
	L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	L.marker(coords).addTo(map).bindPopup('Current Location').openPopup();

	//handle clicks on map
	map.on('click', function (mapEvent) {
		e = mapEvent;
		// e.preventDefault();
		console.log('map is clicked');
		console.log(e);

		form.classList.remove('hidden');
		inputDistance.focus();
	});
};

form.addEventListener('submit', function (formEventDefault) {
	formEventDefault.preventDefault();

	//location
	const { lat, lng } = e.latlng;

	//form info

	//type
	const inputType1 = inputType.value;
	const inputDistance1 = inputDistance.value;
	const inputDuration1 = inputDuration.value;
	const inputCadence1 = inputCadence.value;

	console.log(inputType1, inputDistance1, inputDuration1, inputCadence1);

	let capInputType1 = inputType1
		.split('')
		.shift()
		.toUpperCase()
		.concat(inputType1.slice(1));
	console.log(inputType1);
	console.log(capInputType1);

	const workoutText = `<li class="workout workout--${inputType1}" data-id="1234567890">
    <h2 class="workout__title">${capInputType1} on April 14</h2>
    <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${inputDistance1}</span>
        <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${inputDuration1}</span>
        <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${inputDuration1 / inputDistance1}</span>
        <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${inputCadence1}</span>
        <span class="workout__unit">spm</span>
    </div>
</li>`;

	//add html to UX
	form.insertAdjacentHTML('afterend', workoutText);

	//add marker on that location
	L.marker([lat, lng])
		.addTo(map)
		.bindPopup(
			L.popup({
				maxWidth: 250,
				minWidth: 100,
				autoClose: false,
				closeOnClick: false,
				className: 'running-popup',
			})
		)
		.setPopupContent('Workout')
		.openPopup();
});

const error = function (err) {
	console.warn(err.code, err.message);
};

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(success, error);
} else {
	console.log(`the browser does not support geo location`);
}

inputType.addEventListener('change', function () {
	console.log('chnaged to ..');
	inputCadence.parentElement.classList.toggle('form__row--hidden');
	inputElevation.parentElement.classList.toggle('form__row--hidden');
});
