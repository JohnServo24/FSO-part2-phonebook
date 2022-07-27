import axios from "axios";

const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    // We are returing a promise that has response.data as a parameter/response
    // for the next promise in the .then() chain.
    return axios.get(baseUrl).then(response => response.data);
}

const deleteItem = id => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data);
}

const create = newObject => {
    return axios.post(baseUrl, newObject).then(response => response.data);
}

const update = (newObject, id) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data);
}

export default { getAll, create, update, deleteItem }