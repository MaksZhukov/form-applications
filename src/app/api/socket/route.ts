import socketService from '@/services/socket/socket';
import http from 'http';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	if (!token) {
		return new NextResponse('no token', { status: 401 });
	}
	if (!socketService.io) {
		const httpServer = http.createServer();
		socketService.init(httpServer);
		httpServer.listen(process.env.WS_PORT, () => {
			console.log(`WS LISTEN ON PORT:${process.env.WS_PORT}`);
		});
	}
	return new NextResponse('', { status: 200 });
}
