import { initialize } from '@/db';
import { Role } from '@/db/organization/types';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	try {
		const { OrganizationModel } = await initialize();
		const organizations = await OrganizationModel.findAll({ attributes: ['id', 'name'] });
		return NextResponse.json({ data: organizations });
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
	const uid = formData.get('uid') as string;
	try {
		const { OrganizationModel } = await initialize();
		await OrganizationModel.create({ email, password: await bcrypt.hash(password, +process.env.BCRYPT_SALT), role, name, uid });
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
