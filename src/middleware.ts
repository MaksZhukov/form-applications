import { NextRequest, NextResponse } from 'next/server';
import { getUser } from './services/db/users/users';
import { getBearerToken, verify } from './services/jwt';
import './services/ratelimit/ratelimit';
import hasRateLimit from './services/ratelimit/ratelimit';

export async function middleware(request: NextRequest) {
	if (hasRateLimit(request)) {
		return new NextResponse('Too Many Requests', { status: 429 });
	}
	const token = getBearerToken(request);
	if (request.nextUrl.pathname.startsWith('/api/applications')) {
		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
		try {
			verify(token);
		} catch (err) {
			console.log(err);
			NextResponse.redirect(new URL('/login', request.url));
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
