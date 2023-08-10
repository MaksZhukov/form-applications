import { updateUser } from '@/services/db/users/users';
import { verify } from '@/services/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const token = request.cookies.get('token')?.value;

	if (!token) {
		return new NextResponse('no token for logout', { status: 400 });
	}

	try {
		const {
			payload: { id }
		} = await verify(token);
		await updateUser(id as number, { token: '' });
		const response = new NextResponse();
		response.cookies.delete('token');
		return response;
	} catch (err) {
		return new NextResponse('error with updating user and deleting token', { status: 500 });
	}
}
