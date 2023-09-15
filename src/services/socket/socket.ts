import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";

class SocketService {
    io?: SocketServer;
    init(httpServer: Server) {
        this.io = new SocketServer(httpServer);
        this.io.on('connection', (ws) => {
            console.log(ws)
        })
    }
}

const socketService = new SocketService();

export default socketService