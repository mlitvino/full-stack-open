import { useState, useEffect } from 'react'
import contriesService from './services/countries'
import weatherService from './services/weather'

const DisplayContries = ({ countries, newCountry, shownCountries, onToggleShown, weatherData, setWeatherData }) => {
  const matchedCountries = countries.filter(country => {
    const lowerName = country.name.common.toLowerCase()
    const lowerSearch = newCountry.toLowerCase()
    return lowerName.includes(lowerSearch)
  })

  if (matchedCountries.length == 0) {
    return (
      <>
        Cannot find country, specify another filter
      </>
    )
  }
  else if (matchedCountries.length > 10) {
    return (
      <>
        Too many matches, specify another filter
      </>
    )
  }
  else if (matchedCountries.length > 1) {
    return (
      <>
        {matchedCountries.map(country => {
          const isShown = shownCountries.has(country.name.common)

          return (
            <div key={country.name.common}>
              {country.name.common}
              <ShowButton onClick={() => onToggleShown(country.name.common)} isShown={isShown}/>
              <br/>
              {isShown && (
                <>
                  <Country country={country} />
                  <Weather country={country} weatherData={weatherData} setWeatherData={setWeatherData}/>
                </>
              )}
            </div>
          )
        })}
      </>
    )
  }
  else {
    return (
      <>
        <Country country={matchedCountries[0]}/>
      </>
    )
  }
}

const Form = ({ newCountry, handleNewCountryChange }) => {
  return (
    <>
      <form>
        find countries
        <input value={newCountry} onChange={handleNewCountryChange}/>
      </form>
    </>
  )
}

const Weather = ({ country, weatherData, setWeatherData }) => {
  const weatherForCapital = (weatherData || []).find(weatherCity => {
    return String(weatherCity.name) === String(country.capital)
  })

  console.log(weatherForCapital)

  if (!weatherForCapital) {
    useEffect(() => {
      weatherService
        .getCityWeather(country.capital)
        .then(returnedWeather => {
          setWeatherData(prev => {
            if (prev === null)
              return returnedWeather
            else
              return prev.concat({...returnedWeather})
          })
        })
        .catch(() => {
          console.log('failed to get city weather')
        })
    }, [])
  }

  const getWeatherIconUrl = (weatherForCapital) => {
    const icon_id = weatherForCapital.weather[0].icon
    return weatherService.formIconUrl(icon_id)
  }

  return (
    <>
      <h2>
        Weather in {country.capital}
      </h2>
      {weatherForCapital ? (
        <>
          <p>Temperature {(weatherForCapital.main.temp - 273.15).toFixed(2)} Celsius</p>
          <img
            src={getWeatherIconUrl(weatherForCapital)}
            alt={`Weather icon for ${country.capital}`}
          />
          <p>Wind {weatherForCapital.wind.speed.toFixed(1)} m/s</p>
        </>
      ) : <p>Loading weather…</p>}
    </>
  )
}

const Country = ({ country }) => {
  return (
    <>
      <h1>
        {country.name.common}
      </h1>
      <p>
        Capital {country.capital} <br/>
        Area {country.area}
      </p>
      <h2>
        Languages
      </h2>
      <ul>
        {Object.values(country.languages || {}).map((name, i) => {
          return <li key={i}>{name}</li>
        })}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} style={{ width: 200, height: 'auto' }}/>
    </>
  )
}

const ShowButton = ({ onClick, isShown }) => {
  return (
    <>
      <button onClick={onClick}>
        {isShown ? 'hide' : 'show'}
      </button>
    </>
  )
}

const App = () => {
  const [newCountry, setNewCountry] = useState('')
  const [contries, setContries] = useState(null)
  const [shownCountries, setShownCountries] = useState(new Set())
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {
    contriesService
      .getAll()
      .then(initialCountries => {
        setContries(initialCountries)
      })
      .catch(() => {
        console.log('getAll error')
      })
  }, [])

  if (!contries) {
    return null
  }

  const handleNewCountryChange = (event) => {
    setNewCountry(event.target.value)
  }

  const toggleShown = (countryName) => {
    setShownCountries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(countryName))
        newSet.delete(countryName)
      else
        newSet.add(countryName)
      return newSet
    })
  }

  return (
    <>
      <div>
        <Form
          newCountry={newCountry}
          handleNewCountryChange={handleNewCountryChange}
        />
        <DisplayContries
          countries={contries}
          newCountry={newCountry}
          shownCountries={shownCountries}
          onToggleShown={toggleShown}
          weatherData={weatherData}
          setWeatherData={setWeatherData}
        />
      </div>
    </>
  )
}

export default App
