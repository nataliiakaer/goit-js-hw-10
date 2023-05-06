const URL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(name) {
  return fetch(
    `${URL}/${name}?fields=name,capital,population,languages,flags`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
