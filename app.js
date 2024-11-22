const form = document.querySelector('form')
const city = document.querySelector('#city')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    cityName = city.value
    console.log(cityName)
    getCity(cityName)
    clearScreen()
}
)

function clearScreen() {
    const card = document.querySelector('.card')
    if (card) {
        card.remove()
    }
}

const getCity = async (cityName) => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
    const data = await response.json()
    getWeather(data.results[0].latitude, data.results[0].longitude, data.results[0].name, data.results[0].country, data.results[0].population)
}

const getWeather = async (latitude, longitude, city, country, population) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
    const data = await response.json()
    console.log(data)
    createCard(city, country, population, data.current.temperature_2m, data.timezone, data.daily.temperature_2m_min, data.daily.temperature_2m_max, data.current.is_day)
}

function createCard(city, country, population, temp, timezone, low, max, isDay) {
    const card = document.createElement('div')
    card.classList.add('card')
    isDay == 1 ? document.body.classList.add('isDay') : document.body.classList.add('isNight')
    card.innerHTML = `
    <div class="head">
      <h2 class="city">${city}</h2>
      <h2 class="temp">${temp} °C</h2>
    </div>
    <div class="info">
      <table>
        <tr>
          <td class='bold'>Country</td>
          <td>${country}</td>
        </tr>
        <tr>
          <td class='bold'>Timezone</td>
          <td>${timezone}</td>
        </tr>
        <tr>
          <td class='bold'>Population</td>
          <td>${population}</td>
        </tr>
        <tr>
          <td class='bold'>Tomorrow's Forecast</td>
          <td>
            <ul>
              <li>Low: ${low} °C</li>
              <li>Max: ${max} °C</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
    `
    document.body.append(card)
}