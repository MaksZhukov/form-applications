import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { parseCookie } from '../string/String';
import { verify } from '../jwt';
import { initialize } from '@/db';

class SocketService {
	io?: SocketServer;
	init(httpServer: Server) {
		this.io = new SocketServer(httpServer);
		this.io.use(this.auth);
		this.io.on('connection', (socket) => {
			console.log('CONNECTED', socket.id);
			this.joinApplicationComments(socket);
			this.comment(socket);
		});
	}

	async auth(socket: Socket, next: (err?: Error) => void) {
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
	}

	joinApplicationComments(socket: Socket) {
		socket.on('join-application-comments', (applicationId: number) => {
			console.log(`JOINED TO APPLICATION(${applicationId}) COMMENTS`);
			socket.join(applicationId.toString());
			socket.emit('join-application-comments');
		});
	}

	comment(socket: Socket) {
		socket.on(
			'comment',
			async ({ text, applicationId, userId }: { text: string; userId: number; applicationId: number }) => {
				const { CommentModel, ApplicationModel } = await initialize();
				const comment = await CommentModel.create({ text, userId });
				await comment.addApplication(applicationId);
				socket.to(applicationId.toString()).emit('comment', comment);
			}
		);
	}
}

const socketService = new SocketService();

export default socketService;
