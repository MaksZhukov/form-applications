import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
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
		const { accessKey } = socket.handshake.auth;
		if (!accessKey) {
			next(new Error('no accessKey'));
		}
		const token = accessKey.replace(process.env.SOCKET_HASH_SALT, '');
		try {
			await verify(token);
			next();
		} catch (err) {
			next(new Error('wrong token'));
		}
	}

	joinApplicationComments(socket: Socket) {
		socket.on('join-application-comments', (applicationId: number) => {
			console.log(`JOINED TO COMMENTS FOR APPLICATION ${applicationId}`);
			socket.join(applicationId.toString());
			socket.emit('join-application-comments');
		});
		socket.off('join-application-comments', (applicationId: number) => {
			console.log(`LEAVED COMMENTS FOR APPLICATION ${applicationId}`);
			socket.leave(applicationId.toString());
		});
	}

	comment(socket: Socket) {
		socket.on(
			'comment',
			async ({
				text,
				applicationId,
				applicationType = 'common',
				userId
			}: {
				text: string;
				userId: number;
				applicationId: number;
				applicationType: 'common' | 'internal';
			}) => {
				if (text) {
					const { CommentModel, UserModel } = await initialize();
					const comment = await CommentModel.create({ text, userId }, { include: [UserModel] });

					await (applicationType === 'common'
						? comment.addApplication(applicationId)
						: comment.addInternalApplication(applicationId));

					const result = await CommentModel.findByPk(comment.dataValues.id, {
						include: [{ model: UserModel, attributes: ['id', 'name'] }]
					});
					this.io?.to(applicationId.toString()).emit('comment', result);
				}
			}
		);
	}
}

const socketService = new SocketService();

export default socketService;
