import { API_LIMIT_ITEMS } from '@/constants';
import { initialize } from '@/db';
import { Role } from '@/db/organization/types';
import bcrypt from 'bcrypt';
import { isUndefined, omitBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
	const organizationId = request.nextUrl.searchParams.get('organizationId') as string;
	const rawOnlyCustomers = request.nextUrl.searchParams.get('onlyCustomers') as string;
	const search = request.nextUrl.searchParams.get('search') as string;
	const onlyCustomers = rawOnlyCustomers === null ? undefined : rawOnlyCustomers === 'true';
	const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || API_LIMIT_ITEMS;
	const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
	try {
		const { UserModel, OrganizationModel } = await initialize();
		const { count, rows } = await UserModel.findAndCountAll({
			attributes: ['id', 'name', 'departmentName', 'role', 'isActive', 'email', 'phone'],
			include: [{ model: OrganizationModel }],
			where: onlyCustomers
				? {
						id: { [Op.ne]: process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID },
						[Op.or]: [
							{ '$organization.name$': { [Op.like]: `%${search}%` } },
							{ '$organization.uid$': { [Op.like]: `%${search}%` } }
						]
				  }
				: omitBy({ organizationId }, isUndefined),
			limit,
			offset
		});
		const result = { data: rows, meta: { total: count } };
		return NextResponse.json(result);
	} catch (err) {
		console.log(err);
		return new NextResponse('error getting users', { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const role = (formData.get('role') as Role) || 'regular';
	const name = formData.get('name') as string;
	const phone = formData.get('phone') as string;
	const departmentName = formData.get('departmentName') as string;
	const organizationId = formData.get('organizationId') as string;
	try {
		const { UserModel } = await initialize();
		await UserModel.create({
			email: email.trim(),
			departmentName: departmentName.trim(),
			password: await bcrypt.hash(password, +process.env.BCRYPT_SALT),
			role,
			phone,
			name: name.trim(),
			organizationId: +organizationId
		});
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
