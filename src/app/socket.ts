import { io, Socket } from 'socket.io-client';
import { fetchSocket } from './api/socket';

class SocketService {
	socket?: Socket;
	init() {
		this.socket = io(process.env.NEXT_PUBLIC_WS_HOST, { transports: ['websocket'] });
		this.socket.on('connect', () => {
			console.log('socket connected');
		});
		this.socket.on('connect_error', (err) => {
			console.log(err);
			fetchSocket();
		});
	}
}

export const socketService = new SocketService();
