import { getUser, updateUser } from '@/services/db/users/users';
import { sign } from '@/services/jwt';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const {
		data: { password, email }
	} = await request.json();
	const userData = await getUser({ email });
	if (!userData) {
		return new NextResponse('wrong email', { status: 400 });
	}
	if (!(await bcrypt.compare(password, userData.password))) {
		return new NextResponse('wrong password', { status: 400 });
	}
	const token = await sign({ id: userData.id, email, password, role: userData.role });
	try {
		if (await updateUser(userData.id, { token })) {
			const response = NextResponse.json('', { status: 200 });
			response.cookies.set('token', token);
			return response;
		}
	} catch (err) {
		return new NextResponse('error', { status: 400 });
	}
}
