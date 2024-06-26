import { initialize } from '@/db';
import { isNil, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	const formData = await request.formData();
	const name = formData.get('name') as string;
	const address = formData.get('address') as string;
	const phone = formData.get('phone') as string;
	const email = formData.get('email') as string;
	const responsibleUserId = formData.get('responsibleUserId') as string;
	try {
		const { OrganizationModel } = await initialize();
		await OrganizationModel.update(
			{
				name,
				address,
				email,
				phone,
				responsibleUserId: responsibleUserId === 'none' ? null : +responsibleUserId
			},
			{ where: { id } }
		);
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
