const URL = 'https://restcountries.com/v3.1/name/';
const options = ['name', 'capital', 'population', 'flags', 'languages'];

// Початкова функція
function fetchCountries(query) {
  return fetch(`${URL}${query}?fields=${options.join(',')}`).then(response => {
    if (!response.ok) {
      throw new Error('Response error');
    }
    return response.json();
  });
}

export default fetchCountries;

