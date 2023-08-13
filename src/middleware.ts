import { NextRequest, NextResponse } from 'next/server';
import { verify } from './services/jwt';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	if (request.nextUrl.pathname === '/api/applications' || request.nextUrl.pathname === '/api/organization') {
		if (!token) {
			const res = new NextResponse('no token', { status: 401 });
			res.cookies.delete('token');
			return res;
		}
		try {
			await verify(token);
			return NextResponse.next();
		} catch (err) {
			const res = new NextResponse('no token', { status: 401 });
			res.cookies.delete('token');
			return res;
		}
	}
	if (request.nextUrl.pathname.startsWith('/login')) {
		if (token) {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}
	if (request.nextUrl.pathname === '/api/organizations' && request.method === 'POST') {
		let isAdmin = false;
		if (token) {
			const {
				payload: { role }
			} = await verify(token);
			isAdmin = role === 'admin';
		}
		if (token !== process.env.ADMIN_TOKEN ? !isAdmin : true) {
			return new NextResponse('wrong token', { status: 401 });
		}
	}

	if (request.nextUrl.pathname === '/api/organizations' && request.method === 'GET' && token) {
		try {
			const {
				payload: { role }
			} = await verify(token);
			if (role === 'admin') {
				return NextResponse.next();
			}
		} catch (err) {
			const res = new NextResponse('no permissions', { status: 401 });
			res.cookies.delete('token');
			return res;
		}
	}
}
