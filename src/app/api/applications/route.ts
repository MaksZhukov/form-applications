import { DATE_PATTERN } from '@/app/constants';
import { API_LIMIT_ITEMS } from '@/constants';
import { initialize } from '@/db';
import { ApplicationStatus } from '@/db/application/types';
import { verify } from '@/services/jwt';
import { isNil, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || API_LIMIT_ITEMS;
	const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
	const status = request.nextUrl.searchParams.get('status') as ApplicationStatus | undefined;
	const organizationIdParam = request.nextUrl.searchParams.get('organizationId');
	const responsibleUserId = request.nextUrl.searchParams.get('responsibleUserId') || null;

	if (limit > API_LIMIT_ITEMS) {
		return new NextResponse("limit param isn't valid", { status: 400 });
	}
	const { ApplicationModel, ApplicationInternalModel, OrganizationModel, UserModel } = await initialize();
	try {
		const {
			payload: { role, organizationId }
		} = await verify(token);
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		const { rows, count } = await Model.findAndCountAll({
			where: omitBy(
				{
					isArchived: false,
					status,
					organizationId: role === 'admin' ? organizationIdParam : organizationId,
					responsibleUserId
				},
				isNil
			),
			order: [['createdAt', 'DESC']],
			include: [
				{ model: OrganizationModel, attributes: ['id', 'uid', 'name'] },
				{ model: UserModel, attributes: ['id', 'name'], as: 'responsibleUser' }
			],
			limit,
			offset
		});
		const result = { data: rows, meta: { total: count } };
		return NextResponse.json(result);
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting applications: ${err.message}`, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const {
		payload: { organizationId, role }
	} = await verify(request.cookies.get('token')?.value as string);
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
	const responsibleUserId = formData.get('responsibleUserId') as string;

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

	let values: { [key: string]: string | number | boolean | null } = {
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
		values.responsibleUserId = responsibleUserId === 'none' ? null : responsibleUserId;
	} else {
		values.forWhom = forWhom;
		values.redirection = redirection;
		values.departmentName = departmentName;
	}

	const { ApplicationModel, ApplicationInternalModel } = await initialize();
	const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
	try {
		//@ts-expect-error error
		const application = await Model.create(values);

		return NextResponse.json({ data: application });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with creating application: ${err.message}`, { status: 500 });
	}
}
