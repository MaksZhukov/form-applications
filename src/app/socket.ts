import { io, Socket } from 'socket.io-client';
import { fetchSocket } from './api/socket';

class SocketService {
	socket?: Socket;
	async init() {
		const {
			data: {
				data: { accessKey }
			}
		} = await fetchSocket();
		this.socket = io(process.env.NEXT_PUBLIC_WS_HOST, { auth: { accessKey }, transports: ['websocket'] });
		this.socket.on('connect', () => {
			console.log('socket connected');
		});
		this.socket.on('connect_error', (err) => {
			console.log(err);
		});
	}
}

export const socketService = new SocketService();
