import { NextRequest, NextResponse } from 'next/server';
import { getUser } from './services/db/users/users';
import { getBearerToken, verify } from './services/jwt';
import hasRateLimit from './services/ratelimit/ratelimit';

export async function middleware(request: NextRequest) {
	// if (hasRateLimit(request)) {
	// 	return new NextResponse('Too Many Requests', { status: 429 });
	// }
	const token = getBearerToken(request);
	if (request.nextUrl.pathname.startsWith('/api/applications') || request.nextUrl.pathname.startsWith('/api/user')) {
		if (!token) {
			return new NextResponse('wrong token', { status: 401 });
		}
		try {
			verify(token);
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
