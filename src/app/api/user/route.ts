import { getUser } from '@/services/db/users/users';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const userData = await getUser({ token });
	if (!userData) {
		return new NextResponse('wrong token', { status: 400 });
	}
	return NextResponse.json({ data: { token, id: userData.id, email: userData.email, role: userData.role } });
}
