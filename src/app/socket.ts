import { io, Socket } from 'socket.io-client';
import { fetchSocket } from './api/socket';

class SocketService {
	socket?: Socket;
	loading?: boolean;
	async init() {
		this.loading = true;
		const {
			data: {
				data: { accessKey }
			}
		} = await fetchSocket();
		this.socket = io(process.env.NEXT_PUBLIC_WS_HOST, { auth: { accessKey }, transports: ['websocket'] });
		this.socket.on('connect', () => {
			console.log('socket connected');
			this.loading = false;
		});
		this.socket.on('connect_error', (err) => {
			console.log(err);
            this.loading = false;
		});
	}
}

export const socketService = new SocketService();
