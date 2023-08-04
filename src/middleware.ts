import { NextRequest, NextResponse } from 'next/server';
import { getUser } from './services/db/users/users';
import { verify } from './services/jwt';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	if (request.nextUrl.pathname.includes('uploads')) {
		if (!token) {
			return new NextResponse('no token', { status: 401 });
		}
		try {
			await verify(token);
		} catch (err) {
			return new NextResponse('wrong token', { status: 401 });
		}
	}
	if (request.nextUrl.pathname.startsWith('/api/applications') || request.nextUrl.pathname.startsWith('/api/user')) {
		if (!token) {
			return new NextResponse('no token', { status: 401 });
		}
		try {
			await verify(token);
		} catch (err) {
			return new NextResponse('wrong token', { status: 401 });
		}
		const user = await getUser({ token });
		if (user) {
			return NextResponse.next();
		}
	}
	if (request.nextUrl.pathname.startsWith('/api/users') && request.method === 'POST') {
		if (token !== process.env.ADMIN_TOKEN) {
			return new NextResponse('wrong token', { status: 400 });
		}
	}
}
