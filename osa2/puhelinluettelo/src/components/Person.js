const Person = ({ person, deletePerson }) => {
    const label = 'delete'
    
    return (
        <li>
        {[person.name,' ', person.number]}
        <button onClick={deletePerson}>{label}</button>
        </li>
    )
}

export default Person
