import { API_LIMIT_ITEMS } from '@/constants';
import { initialize } from '@/db';
import { isUndefined, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';

const isProd = process.env.NODE_ENV === 'production';

export async function GET(request: NextRequest) {
	try {
		const { OrganizationModel, UserModel } = await initialize();
		const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || API_LIMIT_ITEMS;
		const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
		const search = request.nextUrl.searchParams.get('search');
		const { rows, count } = await OrganizationModel.findAndCountAll({
			attributes: ['id', 'name', 'createdAt', 'address', 'uid'],
			limit,
			offset,
			order: [['name', 'ASC']],
			where: search
				? omitBy(
						{
							[Op.or]: [{ name: { [Op.substring]: search } }, { uid: { [Op.substring]: search } }],
							...(isProd ? { id: { [Op.ne]: process.env.NEXT_PUBLIC_DEFAULT_ORGANIZATION_ID } } : {})
						},
						isUndefined
				  )
				: { ...(isProd ? { id: { [Op.ne]: process.env.NEXT_PUBLIC_DEFAULT_ORGANIZATION_ID } } : {}) },
			include: [{ model: UserModel, attributes: ['id', 'name'], as: 'responsibleUser' }]
		});

		return NextResponse.json({ data: rows, meta: { total: count } });
	} catch (err) {
		console.log(err);
		return new NextResponse('error getting users', { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const uid = formData.get('uid') as string;
	const name = formData.get('name') as string;
	const address = formData.get('address') as string;
	const email = formData.get('email') as string;
	const phone = formData.get('phone') as string;
	const responsibleUserId = formData.get('responsibleUserId') as string;
	try {
		const { OrganizationModel } = await initialize();
		await OrganizationModel.create({
			name,
			address,
			uid,
			email,
			phone,
			responsibleUserId: responsibleUserId === 'none' ? null : +responsibleUserId
		});
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
