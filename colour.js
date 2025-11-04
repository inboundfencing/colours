let coloursData = {};
let ascending = true;

const container = document.getElementById('colour-container');
const sortSelect = document.getElementById('sort');
const toggleButton = document.getElementById('toggle-order');

// Load colours from local JSON file
fetch('colours.json')
.then(response => response.json())
.then(data => {
coloursData = data;
renderColours();
})
.catch(err => {
container.textContent = 'Error loading colours.json';
console.error(err);
});

// Convert hex to HSL for hue sorting
function hexToHSL(hex) {
hex = hex.replace('#', '');
let r = parseInt(hex.substring(0, 2), 16) / 255;
let g = parseInt(hex.substring(2, 4), 16) / 255;
let b = parseInt(hex.substring(4, 6), 16) / 255;

let max = Math.max(r, g, b);
let min = Math.min(r, g, b);
let h, s, l;
l = (max + min) / 2;

if (max === min) {
h = s = 0; // grayscale
} else {
const d = max - min;
s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
switch (max) {
  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
  case g: h = (b - r) / d + 2; break;
  case b: h = (r - g) / d + 4; break;
}
h /= 6;
}
return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function renderColours() {
container.innerHTML = '';
const colourArray = Object.entries(coloursData);

const sortBy = sortSelect.value;
if (sortBy === 'hue') {
colourArray.sort((a, b) => hexToHSL(a[1].hex).h - hexToHSL(b[1].hex).h);
} else {
colourArray.sort((a, b) => a[0].localeCompare(b[0]));
}

if (!ascending) colourArray.reverse();

for (const [name, colour] of colourArray) {
const card = document.createElement('div');
card.className = 'colour-card';

const swatch = document.createElement('div');
swatch.className = 'swatch';
swatch.style.backgroundColor = colour.hex;

const info = document.createElement('div');
info.className = 'info';

const title = document.createElement('h3');
title.textContent = name;

const hex = document.createElement('div');
hex.className = 'hex';
hex.textContent = colour.hex;

const aliases = document.createElement('div');
aliases.className = 'aliases';
aliases.textContent = colour.aliases.length > 0
  ? 'Also known as: ' + colour.aliases.join(', ')
  : '';

info.appendChild(title);
info.appendChild(hex);
info.appendChild(aliases);

card.appendChild(swatch);
card.appendChild(info);
container.appendChild(card);
}
}

// Change sorting method
sortSelect.addEventListener('change', renderColours);

// Toggle ascending/descending
toggleButton.addEventListener('click', () => {
ascending = !ascending;
toggleButton.textContent = ascending ? 'Ascending' : 'Descending';
renderColours();
});
