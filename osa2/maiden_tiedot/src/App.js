import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

const Countries = ({ countriesToShow }) => {
    if(countriesToShow.length<10)
        return(
            countriesToShow.map(country =>
                <Country
                key={country.name}
                country={country}
                />
            )
        )
}

const Filter = (props) => {
    return(
        <div> filter shown with <input value={props.newFilter} onChange={props.handleFilterChange}/></div>
    )
}

function App() {

    const [countries, setCountries] = useState([])
    const [newFilter, setNewFilter] = useState('')
    const [notification, setNotification] = useState('Too many matches, specify another filter')
    const [languages, setLanguages] = useState(null)
    const [capital, setCapital] = useState('')
    const [area, setArea] = useState('')
    const [flag, setFlag] = useState(null)

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value)
        if(filteredCountries.length < 10){
            setNotification('') 
        }
        if(filteredCountries.length ==1){
            handleInformation(filteredCountries[0].name)
        }
        else
        {
            setNotification('Too many matches, specify another filter')
            setLanguages(null)
            setCapital('')
            setArea('')
            setFlag(null)
        }
    }

    const handleInformation = (name) => {
        axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
            .then(response => {
                setLanguages(Object.values(response.data.languages))
                setCapital(`capital ${response.data.capital}`)
                setArea(`area ${response.data.area}`)
                setFlag(response.data.flags.png)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(newFilter.toLowerCase())
    )

    const countriesToShow = newFilter ? filteredCountries : countries

    useEffect(() => {
        axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
            .then(response => {
                //haetaan kaikki maiden nimet
                const countryNames = response.data.map(country => country.name.common)
                //tehdään objekti jokaiselle nimelle
                const countryObjects = countryNames.map(countryName => ( {name: countryName }))
                // asetetaan objektit näkymään 
                setCountries(countryObjects)
            })
    }, [])

    return (
        <div> 
        <Filter newFilter = {newFilter} handleFilterChange = {handleFilterChange}/>
        {countriesToShow.length === 1 ? (
            <h2>{countriesToShow[0].name}</h2>
        ) : (
            <Countries countriesToShow={countriesToShow.slice(0,10)}/>
        )}
        <div>{capital}</div>      
        <div>{area}</div>
        <br/>
        {notification}
        {languages && (
            <div>
           <strong> Languages:</strong>
            <div>
            <ul>
            {languages.map(language => (
                <li key={language}>{language}</li>
            ))}
            </ul>
            </div>
            {flag && <img src={flag} alt="Flag" />}
            </div>
        )}
        </div>
    );
}

export default App;
