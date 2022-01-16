import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Button = ({ func, text }) => {
  return (
    <>
      <button onClick={func}>{text}</button>
    </>
  )
}

const Langs = ({ langs }) => {
  return (
    <>
      <li>{langs}</li>
    </>
  )
}

const SpecificCountry = ({ onlyCountry }) => {
  return (
    <>
      <h1>{onlyCountry.name.common}</h1>
      <p>capital {onlyCountry.capital}</p>
      <p>population {onlyCountry.population}</p>
      <h2>languages</h2>
      <ul>
        {/*onlyCountry.languages = filteredCountries[0].languages, it is an obj where values of the obj = the exact languages. 
        we can still use map to render an obj besides an array */}
        {Object.keys(onlyCountry.languages).map((key) => (
          <Langs key={onlyCountry.languages[key]} langs={onlyCountry.languages[key]} />
        ))}
      </ul>
      <img src={onlyCountry.flags.png} />
      <Weather city={onlyCountry.capital} />
    </>
  )
}

const MultipleCountries = ({ name, countriesArray }) => {
  const [show, setShow] = useState(false)
  const toggle = () => {
    setShow(!show)
  }
  return (
    <div>
      {name} <Button func={toggle} text='show' />
      {/* show specific country info only if button = true. Buttons default to false, aka hidden  */}
      {/*try console.log(countriesArray, show), you will see countriesArray reflects a list of filtered countries */}
      {show && <SpecificCountry onlyCountry={countriesArray} />}
    </div>
  )
}


const SelectedCountries = ({ filteredCountries }) => {

  if (filteredCountries.length > 10) {
    return 'Too many matches, specify another filter'
  } else if (filteredCountries.length === 1) {
    // after filtered, you will get [{ the only country }] when you console.log(filteredCountries) 
    // we see it is an array of obj, filteredCountries is the array, filteredCountries[0] is the only obj
    return (
      <>
        <SpecificCountry onlyCountry={filteredCountries[0]} />
      </>
    )
  } else {
    return (
      <>
        {filteredCountries.map((country) => (
          <MultipleCountries key={country.name.common} name={country.name.common} countriesArray={country} />
        ))}
      </>
    )
  }
}

const WeatherInfo = ({ weather }) => {
  return (
    <>
      <p><b>temperature:</b>{Math.round(weather.main.temp)} fahrenheit, {Math.round((weather.main.temp - 32) * 5 / 9)} celsius</p>
      <p><img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} /> </p>
      <p><b>wind:</b> {weather.wind.speed} mph</p>
    </>
  )
}


const Weather = ({ city }) => {
  const [weather, setWeather] = useState([])
  const [finishedFetching, setFinishedFetching] = useState(false)
  const api_key = process.env.REACT_APP_API_KEY
  useEffect(() => {

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
        {/*Axios call is async function, and template gets rendered immediately while weatherData prop is an empty array. */ }
        {/* so I set a condition to only render if === true. And === true only after getting data */ }
        setFinishedFetching(true)
      })

  }, [])
  return (
    <div>
      <h2>Weather in {city}</h2>
      {finishedFetching === true && <WeatherInfo weather={weather} />}
    </div>
  )
}

console.log(process.env.REACT_APP_WEATHER_API_KEY)
const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        // console.log(response.data[0].name.common)
        // we can see that response = obj, response.data = array. We can use map to render the list from the array
        setCountries(response.data)
      })
    // remember to use [], otherwise you will get a console log that's always running
  }, [])
  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = filter === ''
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      find countries <input onChange={handleChange} />
      <div>
        <SelectedCountries filteredCountries={filteredCountries} />
      </div>
    </>
  )
}

export default App;
