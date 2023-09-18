import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { parseCookie } from '../string/String';
import { verify } from '../jwt';

class SocketService {
	io?: SocketServer;
	init(httpServer: Server) {
		this.io = new SocketServer(httpServer);
		this.io.use(async (socket, next) => {
			const { token } = parseCookie(socket.handshake.headers.cookie);
			if (!token) {
				next(new Error('no token'));
			}
			try {
				await verify(token);
				next();
			} catch (err) {
				next(new Error('wrong token'));
			}
		});
		this.io.on('connection', (ws) => {
			console.log('CONNECTED', ws.id);
		});
	}
}

const socketService = new SocketService();

export default socketService;
