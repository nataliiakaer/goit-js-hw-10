import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onSubmitContry, DEBOUNCE_DELAY));

function onSubmitContry(evn) {
  evn.preventDefault();

  const inputName = evn.target.value.trim();
  if (!inputName) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(inputName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        countryList.innerHTML = '';
        createMarkupCountryList(data);
        countryInfo.innerHTML = '';
      } else {
        countryInfo.innerHTML = '';
        createMarkupCountryInfo(data);
        countryList.innerHTML = '';
      }
    })
    .catch(() => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupCountryList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
      <img class="country-list__img" src="${flags.svg}" alt="flag" />
      <p class="country-list__text">${name.common}</p>
    </li>`;
    })
    .join('');
  return countryList.insertAdjacentHTML('beforeend', markup);
}

function createMarkupCountryInfo(data) {
  const markup = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-info__div">
    <img class="country-info__img" src="${flags.svg}" alt="flag" />
    <h1 class="country-info__name">${name.common}</h1>
  </div>
  <ul class="country-info">
    <li class="country-info__item">
      <span class="country-info__span">Capital: </span>${capital}
    </li>
    <li class="country-info__item">
      <span class="country-info__span">Population: </span>${population}
    </li>
    <li class="country-info__item">
      <span class="country-info__span">Languages: </span>${Object.values(
        languages
      ).join(', ')}
    </li>
  </ul>`;
    })
    .join('');

  return countryInfo.insertAdjacentHTML('beforeend', markup);
}
