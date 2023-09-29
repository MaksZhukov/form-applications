import { DATE_PATTERN } from '@/app/constants';
import { initialize } from '@/db';
import { ApplicationStatus } from '@/db/application/types';
import { verify } from '@/services/jwt';
import { isNil, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const id = parseInt(request.nextUrl.pathname.split('/')[3]);
	const token = request.cookies.get('token')?.value as string;
	try {
		const {
			payload: { organizationId, role }
		} = await verify(token);
		const { ApplicationInternalModel, OrganizationModel } = await initialize();
		const data = await ApplicationInternalModel.findOne({
			where: role === 'admin' ? { id } : { id, organizationId: organizationId as number },
			include: { model: OrganizationModel, attributes: ['id', 'name'] }
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;
	const token = request.cookies.get('token')?.value as string;
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const status = formData.get('status') as ApplicationStatus;
	const description = formData.get('description') as string;
	const organizationIdForm = formData.get('organizationId') as string;
	const comment = formData.get('comment') as string;
	const forWhom = formData.get('forWhom') as string;
	const redirection = formData.get('redirection') as string;
	const departmentName = formData.get('departmentName') as string;
	const name = formData.get('name') as string;
	const isUrgent = formData.get('isUrgent') as string;
	const isArchived = formData.get('isArchived') as string;

	if (!title || !description || !name) {
		return new NextResponse('required fields', { status: 400 });
	}

	const {
		payload: { organizationId, role }
	} = await verify(token);

	const { ApplicationInternalModel, OrganizationModel } = await initialize();
	try {
		await ApplicationInternalModel.update(
			omitBy(
				{
					title,
					description,
					forWhom,
					departmentName,
					comment,
					status,
					isArchived: Boolean(isArchived),
					name,
					isUrgent: Boolean(isUrgent),
					redirection,
					organizationId: organizationIdForm
				},
				isNil
			),
			{ where: role === 'admin' ? { id } : { id, organizationId: organizationId as number } }
		);
		const data = await ApplicationInternalModel.findByPk(id, {
			include: { model: OrganizationModel, attributes: ['id', 'uid', 'name'] }
		});

		return NextResponse.json({ data });
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(`Error with updating application: ${err.message}`, { status: 500 });
		}
	}
}
