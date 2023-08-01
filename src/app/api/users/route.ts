import { createUser } from '@/services/db/users/users';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const {
		data: { password, email, role }
	} = await request.json();
	if (await createUser({ password: await bcrypt.hash(password, 10), email, role })) {
		return new NextResponse('success', { status: 200 });
	}
}
