import { NextRequest, NextResponse } from 'next/server';
import { getUser } from './services/db/users/users';
import { verify } from './services/jwt';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	if (request.nextUrl.pathname === '/api/applications' || request.nextUrl.pathname === '/api/user') {
		if (!token) {
			const res = new NextResponse('no token', { status: 401 });
			res.cookies.delete('token');
			return res;
		}
		try {
			await verify(token);
		} catch (err) {
			const res = new NextResponse('no token', { status: 401 });
			res.cookies.delete('token');
			return res;
		}
		const user = await getUser({ token });
		if (user) {
			return NextResponse.next();
		}
	}
	if (request.nextUrl.pathname.startsWith('/login')) {
		if (token) {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}
	if (request.nextUrl.pathname === '/api/users' && request.method === 'POST') {
		if (token !== process.env.ADMIN_TOKEN) {
			return new NextResponse('wrong token', { status: 401 });
		}
	}
}
