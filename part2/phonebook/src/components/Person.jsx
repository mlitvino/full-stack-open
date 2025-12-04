const Person = ({ person, onDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => onDelete(person.name)}>delete</button>
    </li>
  )
}

export default Person
