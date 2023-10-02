import { initialize } from '@/db';
import { Role } from '@/db/organization/types';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const organizationId = request.nextUrl.searchParams.get('organizationId') as string;
	try {
		const { UserModel } = await initialize();
		const users = await UserModel.findAll({ attributes: ['id', 'name'], where: { organizationId } });
		console.log(users);
		return NextResponse.json({ data: users });
	} catch (err) {
		return new NextResponse('error getting users', { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const role = (formData.get('role') as Role) || 'regular';
	const name = formData.get('name') as string;
	const organizationId = formData.get('organizationId') as string;
	try {
		const { UserModel } = await initialize();
		await UserModel.create({
			email,
			password: await bcrypt.hash(password, +process.env.BCRYPT_SALT),
			role,
			name,
			organizationId: +organizationId,
		});
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
