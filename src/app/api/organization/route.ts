import { initialize } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	// IT NEEDS for BUILD ''
	const token = request.cookies.get('token')?.value || '';
	console.log(token);
	const { OrganizationModel } = await initialize();
	const userData = (
		await OrganizationModel.findOne({ where: { token }, attributes: ['id', 'email', 'role'] })
	)?.toJSON();
	if (!userData) {
		return new NextResponse('wrong token', { status: 401 });
	}
	return NextResponse.json({ data: userData });
}
