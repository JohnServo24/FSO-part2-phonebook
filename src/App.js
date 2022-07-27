import React, { useState, useEffect } from "react";
import noteService from "./services/notes";

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

const Persons = ({ list, deleteNum }) => list.map(person =>
  <div key={person.id}>
    {person.name} {person.number}
    <button value={person.id} onClick={deleteNum(person.name)}>
      delete
    </button>
  </div>)

const App = () => {
  const [person, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const setPersonsFromData = () => {
    noteService
      .getAll()
      .then(phonebook => {
        setPersons(phonebook);
      })
  }

  useEffect(setPersonsFromData, []);

  const checkDuplicate = () => {
    if (person.find(person => newName === person.name)) return true;

    return false;
  }

  const addName = e => {
    e.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    if (checkDuplicate()) {
      if (window.confirm(`${newName} is already added to the phonebook, 
        replace the old number with new one?`)) {

        // Find person's id
        const id = person.find(item => item.name === newName).id;

        noteService
          .update(newPerson, id)
          .then(newNum => {
            setPersons(person.map(item => item.id === id ? newNum : item));
          });
      };
    } else {
      noteService
        .create(newPerson)
        .then(personData => {
          setPersons(person.concat(personData));
        })
    }

    setNewName('');
    setNewNumber('');
  }

  const deleteNum = (name) => {
    return e => {
      if (window.confirm(`Delete ${name}`)) {
        // != because num.id is an int and e.target.value is a string
        const filteredNumbers = person.filter(num => num.id != e.target.value);
        noteService
          .deleteItem(e.target.value)
          .then(() => {
            setPersons(filteredNumbers);
          });
      }
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
      <Persons list={filteredItems} deleteNum={deleteNum} />
    </div>
  )
}

export default App;

