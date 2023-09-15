import socketService from '@/services/socket/socket';
import http from 'http';
import { NextResponse } from 'next/server';
import { Server } from 'socket.io';


export async function GET() {
	if (!socketService.io) {
		const httpServer = http.createServer()
		socketService.init(httpServer)
		httpServer.listen(process.env.WS_PORT);
	};
	return new NextResponse('', { status: 200 })
}