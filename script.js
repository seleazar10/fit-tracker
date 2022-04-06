'use script';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const mapBox = document.getElementById('map');

class Workout {
	date = new Date();
	id = (Date.now() + '').slice(-10);
	clicks = 0;

	constructor(coords, distance, duration) {
		this.coords = coords;
		this.distance = distance;
		this.duration = duration;
	}

	_setDescription() {
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

		this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
			months[this.date.getMonth()]
		} ${this.date.getDate()}`;
		console.log(this.description);
	}
	click() {
		this.click++;
	}
}

class Running extends Workout {
	type = 'running';
	constructor(coords, distance, duration, cadence) {
		super(coords, distance, duration);
		this.cadence = cadence;
		this.calcPace();
		this._setDescription();
	}

	// pace = mins/km
	calcPace() {
		this.pace = this.duration / this.distance;
		return this.pace;
	}
}

class Cycling extends Workout {
	type = 'cycling';
	constructor(coors, distance, duration, elevationGain) {
		super(coors, distance, duration);
		this.elevationGain = elevationGain;
		this.calcSpeed();
		this._setDescription();
	}

	calcSpeed() {
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
}

console.log(Running);

const run1 = new Running([32, -10], 20, 10, 6);
const cycl1 = new Cycling([32, -10], 30, 10, 4);
console.log(run1);

/////[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]
class App {
	#map;
	#mapEvent;
	#workouts = [];
	constructor() {
		this._getPosition();

		this._getLocalStorage();

		//////////////////////////////-- submit listener --/////////////////////////////////////////////////
		form.addEventListener('submit', this._newWorkout.bind(this));

		///////////////////////////////--change type of excercise--///////////////
		inputType.addEventListener('change', this._toggleElevationField.bind(this));

		////////////////////////////////////////////////////
		containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
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

		this.#workouts.forEach((work) => {
			// this._renderWorkout(work);
			this.renderWorkoutMarker(work);
		});
	}

	_showForm(mapE) {
		//handle clicks on map
		this.#mapEvent = mapE;
		form.classList.remove('hidden');
		inputDistance.focus();
	}

	_hideForm(mapE) {
		this.#mapEvent = mapE;
		form.style.display = 'none';
		form.classList.add('hidden');
		setTimeout(() => (form.style.display = 'grid'), 1000);
	}

	_toggleElevationField() {
		console.log('toggle between elevation and caadence');
		inputCadence.parentElement.classList.toggle('form__row--hidden');
		inputElevation.parentElement.classList.toggle('form__row--hidden');
	}

	_newWorkout(e) {
		e.preventDefault();

		const validInputs = (...inputs) =>
			inputs.every((inp) => Number.isFinite(Number(inp)));
		const allPositive = (...inputs) => inputs.every((inp) => Number(inp) > 0);

		//save value from form
		const type = inputType.value;
		const distance = inputDistance.value;
		const duration = inputDuration.value;
		const { lat, lng } = this.#mapEvent.latlng;
		let workout;

		//create object from value saved
		//if input is "runnin", create Running class

		if (type === 'running') {
			const cadence = +inputCadence.value;
			console.log(`heres the cadence ${cadence}`);
			if (
				!validInputs(distance, duration, cadence) ||
				!allPositive(distance, duration)
			) {
				return alert('input have to be positive');
			} else {
				workout = new Running([lat, lng], distance, duration, cadence);
			}
		}
		//if running is cycling, create clying class
		if (type === 'cycling') {
			const elevation = Number(inputElevation.value);
			console.log(typeof distance);
			if (
				!Number.isFinite(Number(distance)) ||
				!Number.isFinite(Number(duration)) ||
				!Number.isFinite(Number(elevation))
			) {
				return alert('This is not a number 2');
			} else {
				console.log('this is a number');
				workout = new Cycling([lat, lng], distance, duration, elevation);
			}
		}

		//add class to workout array
		this.#workouts.push(workout);

		//clear field
		inputCadence.value =
			inputDistance.value =
			inputDuration.value =
			inputElevation.value =
				'';

		console.log(this.#mapEvent);

		//render workout on map as marker
		this.renderWorkoutMarker(workout);
		//render workout on list
		this._renderWorkout(workout);

		//rhide form
		this._hideForm(workout);

		//sel local storage to all workouts
		this._setLocalStorage();
	}

	//add marker on that location
	renderWorkoutMarker(workout) {
		L.marker(workout.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: `${workout.type}-popup`,
				})
			)
			.setPopupContent(
				`${workout.type === 'running' ? '🏃‍♂️' : '🚴'} ${workout.description}`
			)
			.openPopup();
	}
	//display array on left user side

	_renderWorkout(workout) {
		console.log(workout);
		let html = `
						<li class="workout workout--${workout.type}" data-id="${workout.id}">
							<h2 class="workout__title">${workout.description}</h2>
							<div class="workout__details">
								<span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴'}</span>
								<span class="workout__value">${workout.distance}</span>
								<span class="workout__unit">km</span>
							</div>
							<div class="workout__details">
								<span class="workout__icon">⏱</span>
								<span class="workout__value">${workout.duration}</span>
								<span class="workout__unit">min</span>
							</div>
				
						`;

		if (workout.type === 'running') {
			// this._setDescription();
			html += `<div class="workout__details">
						<span class="workout__icon">⚡️</span>
						<span class="workout__value">${workout.pace.toFixed(1)}</span>
						<span class="workout__unit">min/km</span>
						</div>
						<div class="workout__details">
						<span class="workout__icon">🦶🏼</span>
						<span class="workout__value">${workout.cadence}</span>
						<span class="workout__unit">spm</span>
						</div>`;
		}
		console.log(html);

		if (workout.type === 'cycling') {
			// this._setDescription();
			html += `<div class="workout__details">
			<span class="workout__icon">⚡️</span>
			<span class="workout__value">${workout.speed.toFixed(1)}</span>
			<span class="workout__unit">min/km</span>
			</div>
			<div class="workout__details">
			<span class="workout__icon">🦶🏼</span>
			<span class="workout__value">${workout.elevationGain}</span>
			<span class="workout__unit">spm</span>
			</div>`;
		}
		console.log(html);

		form.insertAdjacentHTML('afterend', html);
	}

	_moveToPopup(e) {
		console.log(e);
		const workoutEl = e.target.closest('.workout');
		console.log(workoutEl);
		if (!workoutEl) return;
		console.log(this.#workouts);
		const workout = this.#workouts.find((el) => el.id === workoutEl.dataset.id);
		console.log(workout);
		console.log(workout.coords);
		L.marker(workout.coords);
		// workout.click();
	}

	_setLocalStorage() {
		localStorage.setItem('workouts', JSON.stringify(this.#workouts));
	}

	_getLocalStorage() {
		const data = JSON.parse(localStorage.getItem('workouts'));
		console.log(data);

		if (!data) return;

		this.#workouts = data;

		this.#workouts.forEach((work) => {
			this._renderWorkout(work);
			// this._renderWorkoutMarker(work);
		});
	}
}

const app = new App();
