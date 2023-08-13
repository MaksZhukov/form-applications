import { DATE_PATTERN } from '@/app/constants';
import { initialize } from '@/db';
import { ApplicationStatus } from '@/db/application/types';
import { verify } from '@/services/jwt';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const id = parseInt(request.nextUrl.pathname.split('/')[3]);
	const token = request.cookies.get('token')?.value as string;
	try {
		const {
			payload: { id: orgId, role }
		} = await verify(token);
		const { ApplicationModel, OrganizationModel } = await initialize();
		const data = await ApplicationModel.findOne({
			where: { id, organizationId: orgId as number },
			include: { model: OrganizationModel, attributes: ['id', 'name', 'email'] }
		});
		if (data) {
			const result = { data };
			return NextResponse.json(result);
		} else {
			return new NextResponse(`not found`, { status: 400 });
		}
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting applications: ${err.message}`, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const id = parseInt(request.nextUrl.pathname.split('/')[3]);
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const status = formData.get('status') as ApplicationStatus;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;
	const comment = formData.get('comment') as string;
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const isUrgent = formData.get('isUrgent') as string;

	if (!title || !description || !date || !phone || !name) {
		return new NextResponse('required fields', { status: 400 });
	}

	if (!date.match(DATE_PATTERN) || (deadline && !deadline.match(DATE_PATTERN))) {
		return new NextResponse('validate fields', { status: 400 });
	}

	const {
		payload: { id: orgId }
	} = await verify(token);

	const { ApplicationModel, OrganizationModel } = await initialize();

	try {
		await ApplicationModel.update(
			omitBy(
				{
					title,
					description,
					date,
					deadline,
					phone,
					comment,
					status,
					name,
					isUrgent: !!isUrgent,
					email
				},
				isNil
			),
			{ where: { id, organizationId: orgId as number } }
		);
		const data = await ApplicationModel.findByPk(id, {
			include: { model: OrganizationModel, attributes: ['id', 'uid', 'name', 'email'] }
		});

		return NextResponse.json({ data });
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(`Error with updating application: ${err.message}`, { status: 500 });
		}
	}
}
