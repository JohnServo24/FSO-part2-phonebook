import React, { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ filterState, handler }) => {
  return (
    <div>filter shown with <input value={filterState} onChange={handler} /></div>
  )
}

const PersonForm = ({ formHandler, nameState, nameHandler, numState, numHandler }) => {
  return (
    <form onSubmit={formHandler}>
      <div>name: <input value={nameState} onChange={nameHandler} /></div>
      <div>number: <input value={numState} onChange={numHandler} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ list }) => list.map(person => <p key={person.id}>{person.name} {person.number}</p>)

const App = () => {
  const [person, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const setPersonsFromData = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      })
  }

  useEffect(setPersonsFromData, []);

  const checkDuplicate = () => {
    if (person.find(person => newName === person.name)) return true;

    return false;
  }

  const addName = e => {
    e.preventDefault();

    if (checkDuplicate()) {
      alert(`${newName} is already added to the phonebook`);
    } else {
      setPersons(person.concat({
        name: newName,
        number: newNumber,
        id: person.length + 1,
      }));

      setNewName('');
    }
  }

  const filteredItems = person.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  const handleNameChange = e => setNewName(e.target.value);

  const handleNumChange = e => setNewNumber(e.target.value);

  const handleFilter = e => setFilter(e.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterState={filter} handler={handleFilter} />
      <h3>add a new</h3>
      <PersonForm
        formHandler={addName}
        nameState={newName}
        nameHandler={handleNameChange}
        numState={newNumber}
        numHandler={handleNumChange}
      />
      <h3>Numbers</h3>
      <Persons list={filteredItems} />
    </div>
  )
}

export default App;

