import axios from 'axios';
import { getToken } from '../localStorage';

const client = axios.create();

client.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.set('authorization', `Bearer ${getToken()}`);
	}
	return config;
});

export default client;
