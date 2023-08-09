import { createUser } from '@/services/db/users/users';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const {
		data: { password, email, role, organizationName, uid }
	} = await request.json();
	if (!email || !password || !role || !organizationName || !uid) {
		return new NextResponse('required fields', { status: 400 });
	}
	try {
		await createUser({
			email,
			password: await bcrypt.hash(password, 10),
			role,
			organization_name: organizationName,
			uid
		});
	} catch (err) {
		return new NextResponse('error create user', { status: 500 });
	}
	return new NextResponse('success', { status: 200 });
}
