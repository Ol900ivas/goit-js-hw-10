import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

// Доступ до html
const inputEl = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Слухач події на інпуті
inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  // Забороняємо перезавантажувати сторінку
  e.preventDefault();

  const inputEl = e.target;
  console.log(inputEl);
  const query = inputEl.value.trim();
  console.log(query);
  // Якщо в інпуті нічого немає, не відправляємо запит)
  if (!query) {
    return;
  }

  fetchCountries(query)
    .then(countries => {
      resetMarkup();
      // Якщо у відповіді бекенд повернув більше ніж 10 країн, виводимо повідомлення
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        // console.log(countries);
      }
      // Якщо бекенд повернув від 2-х до 10-и країн,
      else if (countries.length >= 2 && countries.length <= 10) {
        resetMarkup();
        createCountriesListMarkup(countries);
      }
      // Якщо знайдена лише одна країна
      else {
        resetMarkup();
        createCountryMarkup(countries);
      }
    })
    .catch(onError)
  
    // .finally(() => (inputEl.value = ''));
}

// Очищуємо розмітку
function resetMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

// Розміщуємо розмітку
function updateMarkup(markup, el) {
  el.innerHTML = markup;
}

// На випадок помилки
function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  resetMarkup();
}

// Робимо розмітку для всього списку країн
function createCountriesListMarkup(countries) {
  const totalMarkup = countries.reduce(
    (markup, data) => markup + createCountryItemMarkup(data),
    ''
  );
  updateMarkup(totalMarkup, countryList);
}

// Робимо розмітку однієї країни зі списку країн
function createCountryItemMarkup({ name, flags }) {
  return `<li class="country-item">
      <img  class="country-flag" src="${flags.svg}" alt="${flags.alt}" width=30px height=25px>
      <p class="country-name">${name.official}</p>
    </li>`;
}

// Робимо розмітку для однієї країни (беремо перший об'єкт з масиву: [0] і деструктуруємо)
function createCountryMarkup(countries) {
  const { name, capital, population, flags, languages } = countries[0];
  const markup = `<div class="wrapper"><img class="country-flag" src="${
    flags.svg
  }" alt="${flags.alt}" width=30px height=25px>
    <h2 class="card-title">${name.official}</h2>
    </div>
    <p class="card-text-key">Capital: <span class="card-text-data">${capital}</span></p>
    <p class="card-text-key">Population: <span class="card-text-data">${population}</span></p>
    <p class="card-text-key">Languages: <span class="card-text-data">${Object.values(
      languages
    )}</span></p>`;

  updateMarkup(markup, countryInfo);
}
