import { initialize } from '@/db';
import { sign } from '@/services/jwt';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
	const {
		data: { password, email }
	} = await request.json();
	const { OrganizationModel } = await initialize();
	const userData = (await OrganizationModel.findOne({ where: { email } }))?.toJSON();
	if (!userData) {
		return new NextResponse('wrong email', { status: 400 });
	}
	if (!(await bcrypt.compare(password, userData.password))) {
		return new NextResponse('wrong password', { status: 400 });
	}
	const token = await sign({ id: userData.id, email, password, role: userData.role });
	try {
		if (await OrganizationModel.update({ token }, { where: { id: userData.id } })) {
			const response = NextResponse.json('', { status: 200 });
			response.cookies.set('token', token, { httpOnly: true });
			return response;
		}
	} catch (err) {
		return new NextResponse('error', { status: 400 });
	}
};
