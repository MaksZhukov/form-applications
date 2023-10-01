import { DATE_PATTERN } from '@/app/constants';
import { initialize } from '@/db';
import { ApplicationStatus } from '@/db/application/types';
import { verify } from '@/services/jwt';
import { isNil, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const id = parseInt(request.nextUrl.pathname.split('/')[3]);
	const token = request.cookies.get('token')?.value as string;
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
	try {
		const {
			payload: { organizationId, role }
		} = await verify(token);
		const { ApplicationModel, ApplicationInternalModel, OrganizationModel } = await initialize();
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		const data = await Model.findOne({
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
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;
	const comment = formData.get('comment') as string;
	const name = formData.get('name') as string;
	const isUrgent = formData.get('isUrgent') as string;
	const isArchived = formData.get('isArchived') as string;

	const email = formData.get('email') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;

	const forWhom = formData.get('forWhom') as string;
	const redirection = formData.get('redirection') as string;
	const departmentName = formData.get('departmentName') as string;

	const organizationIdForm = formData.get('organizationId') as string;

	if (!title || !description || applicationType === 'common' ? !phone : false || !name) {
		return new NextResponse('required fields', { status: 400 });
	}

	if (deadline && !deadline.match(DATE_PATTERN)) {
		return new NextResponse('validate fields', { status: 400 });
	}

	const {
		payload: { organizationId, role }
	} = await verify(token);

	let values: { [key: string]: string | number | boolean } = {
		title,
		description,
		comment,
		deadline: deadline ?? '',
		isArchived: Boolean(isArchived),
		name,
		status: 'в обработке',
		isUrgent: Boolean(isUrgent),
		organizationId: role === 'admin' ? +organizationIdForm : (organizationId as number)
	};

	if (applicationType === 'common') {
		values.email = email;
		values.phone = phone;
	} else {
		values.forWhom = forWhom;
		values.redirection = redirection;
		values.departmentName = departmentName;
	}

	const { ApplicationModel, ApplicationInternalModel, OrganizationModel } = await initialize();
	try {
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		await Model.update(omitBy(values, isNil), {
			where: role === 'admin' ? { id } : { id, organizationId: organizationId as number }
		});
		//@ts-expect-error error
		const data = await Model.findByPk(id, {
			include: { model: OrganizationModel, attributes: ['id', 'uid', 'name'] }
		});

		return NextResponse.json({ data });
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(`Error with updating application: ${err.message}`, { status: 500 });
		}
	}
}
