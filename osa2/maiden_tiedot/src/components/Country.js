
const Country = ({ country}) => {
    return (
        <li>
        {country.name}
        
        <button onClick={console.log("show country information here")}>{`show`}</button>
        </li>
    )
}

export default Country
