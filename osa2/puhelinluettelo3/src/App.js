import { useState, useEffect } from 'react'
import Person from './components/Person'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorNotification from './components/Error'

const Persons = ({ personsToShow, deletePerson }) => {
    return(    
        personsToShow.map(person =>
            <Person
            key={person.name}
            person={person} 
            deletePerson={() => deletePerson(person.id)}
            />
        )
    )
}

const PersonForm = (props) => {
    return(
        <form onSubmit={props.addName}>
        <div>name: <input value={props.newName} onChange={props.handleNameChange}/></div>
        <div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
        <div><button type="submit">add</button></div>
        </form>
    )
}

const Filter = (props) => {
    return(
        <div> filter shown with <input value={props.newFilter} onChange={props.handleFilterChange}/></div>
    )
}

const App = () => {
    const [persons, setPersons] = useState ([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        personService 
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])


    const addName = (event) => {
        event.preventDefault()
        const personObject = {
            name: newName,
            number: newNumber
        }
        for(let i = 0; i<persons.length; i++){

            if(checkForDuplicant(personObject,persons[i]))return;
        }

        personService
            .create(personObject)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNewName('')
                setNewNumber('')
                setNotificationMessage(`Added '${returnedPerson.name}'`)
                setTimeout(() => { setNotificationMessage(null)}, 5000)
                
            })
    }

    const checkForDuplicant = (person1,person2) => {
        if(person1.name === person2.name){
            if(window.confirm(`${person2.name} is already added to phonebook,
                replace the old number with a new one?`))
            {
                // sama nimi läydetty ja tehdään muutos vanhaan tietoona
                // person2 on  jo valmiiksi tallennettu henkilö ja päivitetään siitä vain numero
                const changedPerson ={...person2, number: person1.number}

                personService
                .update(person2.id,changedPerson)
                .then(returnedPerson => {
                    setPersons(persons.map(person => person2.id !== person.id ? person : returnedPerson))
                })
                .catch(error => {
                    setErrorMessage(
                        `Information of ${person2.name} has already been removed from the server.`)
                    setTimeout(() => {
                        setErrorMessage(null)
                        }, 5000)
                })
                setPersons(persons.filter(n => n.id !== person2.id))
                setNewName('')
                setNewNumber('')
                return true;
            }
            // sama nimi löydetty, mutta ei tehdä muutoksia aiempaan tallennukseen
            return true;

        }
        // samalla nimellä ei löydetty tietoja
        return false;
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const deletePerson = (id) => {
        const person = persons.find(n => n.id ===id)
        if( window.confirm(`Delete ${person.name} ?`)){
            personService
                .deleteValue(id)
                .then(() =>
                    setPersons(persons.filter(person => person.id !== id)) 
                )
        }
    }


    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }


    const handleFilterChange = (event) => {

        setNewFilter(event.target.value)
    }

    const filteredPersons = persons.filter(person =>
        // toLowerCase => case-insesitive
        person.name.toLowerCase().includes(newFilter.toLowerCase())
    )

    // if newFilter has value => filteredPersons are set as personsToShow
    const personsToShow = newFilter ? filteredPersons : persons;

    return (
        <div>
        <h2>Phonebook</h2>
        <Notification message={notificationMessage} />
        <ErrorNotification message={errorMessage} />

        <Filter newFilter = {newFilter} handleFilterChange ={handleFilterChange}/>

        <h2>add a new</h2>

        <PersonForm addName = {addName} newName = {newName} handleNameChange = {handleNameChange}
        newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>

        <h2>Numbers</h2>

        <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
        </div>
    )
}

export default App
