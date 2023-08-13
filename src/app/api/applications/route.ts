import { DATE_PATTERN } from '@/app/constants';
import { API_LIMIT_ITEMS } from '@/constants';
import { initialize } from '@/db';
import { ApplicationStatus } from '@/db/application/types';
import { verify } from '@/services/jwt';
import _ from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || API_LIMIT_ITEMS;
	const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
	const status = request.nextUrl.searchParams.get('status') as ApplicationStatus | undefined;
	const organizationId = request.nextUrl.searchParams.get('organizationId');

	if (limit > API_LIMIT_ITEMS) {
		return new NextResponse("limit param isn't valid", { status: 400 });
	}
	const { ApplicationModel, OrganizationModel } = await initialize();
	try {
		const {
			payload: { role, id }
		} = await verify(token);
		const { rows, count } = await ApplicationModel.findAndCountAll({
			where: _.omitBy({ status, organizationId: role === 'admin' ? organizationId : id }, _.isNil),
			order: [['createdAt', 'DESC']],
			include: { model: OrganizationModel, attributes: ['id', 'uid', 'name', 'email'] },
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
		payload: { id }
	} = await verify(request.cookies.get('token')?.value as string);
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;
	const comment = formData.get('comment') as string;
	const name = formData.get('name') as string;
	const isUrgent = formData.get('isUrgent') as string;
	const email = formData.get('email') as string;
	const organizationUserId = formData.get('organizationUserId') as string;

	if (!title || !description || !date || !phone || !name) {
		return new NextResponse('required fields', { status: 400 });
	}

	if (!date.match(DATE_PATTERN) || (deadline && !deadline.match(DATE_PATTERN))) {
		return new NextResponse('validate fields', { status: 400 });
	}

	const { ApplicationModel } = await initialize();
	try {
		const application = await ApplicationModel.create({
			title,
			description,
			deadline,
			phone,
			comment,
			name,
			status: 'в обработке',
			email,
			isUrgent: Boolean(isUrgent),
			organizationId: organizationUserId ? +organizationUserId : (id as number)
		});
		return NextResponse.json({ data: application });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with creating application: ${err.message}`, { status: 500 });
	}
}
