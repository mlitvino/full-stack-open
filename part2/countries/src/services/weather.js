import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org'
const weatherUrl = 'https://openweathermap.org'
const api_key = import.meta.env.VITE_WEATHER_API_KEY

const getCityWeather = (city) => {
  const city_url = `data/2.5/weather?q=${city}`
  const api_url = `&appid=${api_key}`

  const request = axios.get(`${baseUrl}/${city_url}${api_url}`)
  return request.then(response => response.data)
}

const formIconUrl = (icon_id) => {
  const icon_url = `img/wn/${icon_id}@2x.png`

  return String(`${weatherUrl}/${icon_url}`)
}

export default {
  getCityWeather,
  formIconUrl
}
