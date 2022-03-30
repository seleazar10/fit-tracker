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

class App {
	#map;
	#mapEvent;
	constructor() {
		this._getPosition();

		//////////////////////////////submit listener/////////////////////////////////////////////////
		form.addEventListener('submit', this._newWorkout.bind(this));

		///////////////////////////////--change type of running--///////////////
		inputType.addEventListener('change', this._toggleElevationField.bind(this));
	}

	_getPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this._loadMap.bind(this),
				function () {
					console.log('theres an error');
				}
			);
		}
	}

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;
		const mapLink = `https://www.google.com/maps/place/@${latitude},${longitude}`;
		const coords = [latitude, longitude];

		console.log(coords);

		this.#map = L.map('map').setView(coords, 13);
		// console.log(map);
		L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);
		L.marker(coords).addTo(this.#map).bindPopup('Current Location').openPopup();
		this.#map.on('click', this._showForm.bind(this));
	}

	_showForm(mapE) {
		//handle clicks on map
		this.#mapEvent = mapE;
		form.classList.remove('hidden');
		inputDistance.focus();
	}

	_toggleElevationField() {
		console.log('toggle between elevation and caadence');
		inputCadence.parentElement.classList.toggle('form__row--hidden');
		inputElevation.parentElement.classList.toggle('form__row--hidden');
	}

	_newWorkout(e) {
		e.preventDefault();

		//clear field
		inputCadence.value =
			inputDistance.value =
			inputDuration.value =
			inputElevation.value =
				'';

		console.log(this.#mapEvent);
		const { lat, lng } = this.#mapEvent.latlng;
		//add marker on that location
		L.marker([lat, lng])
			.addTo(this.#map)
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
	}
}

const app = new App();
