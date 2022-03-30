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
