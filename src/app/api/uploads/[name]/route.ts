import { getFileByUserId } from '@/services/db/files/files';
import { UserRole } from '@/services/db/users/types';
import { verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const fileName = request.nextUrl.pathname.split('/')[3];
	let userId: number;
	let userRole: string;
	try {
		const res = await verify(token);
		userId = res.payload.id as number;
		userRole = res.payload.role as UserRole;
	} catch (err) {
		return new NextResponse('wrong token', { status: 401 });
	}
	if (userId && userRole !== 'admin') {
		try {
			const res = await getFileByUserId(userId, fileName);
			//@ts-expect-error error
			if (!res.length) {
				throw new Error('no file');
			}
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(err.message, { status: 404 });
		}
	}
	return new NextResponse(await fs.promises.readFile(`./uploads/${fileName}`), { status: 200 });
}
