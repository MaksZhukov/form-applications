import { initialize } from '@/db';
import { isNil, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	try {
		const { OrganizationModel } = await initialize();
		await OrganizationModel.update(omitBy({ email, password: await bcrypt.hash(password, 10) }, isNil), {
			where: { id }
		});
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
