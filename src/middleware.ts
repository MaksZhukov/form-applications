import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { verify } from './services/jwt';
import { Role } from './db/users/types';
import { Method, authPathsByRole, publicPaths, redirectAuthPaths } from './config';
import { matchPath } from './services/route/route';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;

	if (redirectAuthPaths.includes(request.nextUrl.pathname)) {
		if (token) {
			return NextResponse.redirect(new URL('/', request.url));
		} else {
			return;
		}
	}

	if (publicPaths.includes(request.nextUrl.pathname)) {
		return;
	}

	if (!token) {
		const res = new NextResponse('no token', { status: 400 });
		res.cookies.delete('token');
		return res;
	} else if (token !== process.env.SUPER_ADMIN_TOKEN) {
		try {
			const {
				payload: { role }
			} = await verify(token);
			let foundExactWithNoPermissions = false;
			if (
				!authPathsByRole[role as Role].some((item) => {
					if (foundExactWithNoPermissions) {
						return false;
					} else {
						foundExactWithNoPermissions =
							item.path === request.nextUrl.pathname && !item.methods.includes(request.method as Method);
					}
					return (
						matchPath(item.path, request.nextUrl.pathname) &&
						item.methods.includes(request.method as Method)
					);
				})
			) {
				return new NextResponse('no permissions', { status: 403 });
			}
		} catch (err) {
			const res = new NextResponse('invalid token', { status: 401 });
			res.cookies.delete('token');
			return res;
		}
	}
}

export const config = {
	matcher: ['/login', '/api/:path*']
};
