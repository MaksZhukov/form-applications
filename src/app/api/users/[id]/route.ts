import { initialize } from '@/db';
import { isNil, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const departmentName = formData.get('departmentName') as string;
	const rawIsActive = formData.get('isActive') as string;
	const isActive = rawIsActive === null ? undefined : rawIsActive === 'true';
	try {
		const { UserModel } = await initialize();
		await UserModel.update(
			omitBy({ email, password: await bcrypt.hash(password, 10), departmentName, isActive }, isNil),
			{
				where: { id }
			}
		);
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	try {
		const { UserModel } = await initialize();
		await UserModel.destroy({ where: { id } });
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
