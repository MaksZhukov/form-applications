import axios from 'axios';

const client = axios.create({ headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });

export default client;
