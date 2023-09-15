import { initialize } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	// IT NEEDS for BUILD ''
	const token = request.cookies.get('token')?.value;
	if (!token) {
		return new NextResponse('no token', { status: 401 });
	}
	const { UserModel } = await initialize();
	const userData = (
		await UserModel.findOne({
			where: { token },
			attributes: ['id', 'email', 'role'],
			include: 'organization'
		})
	)?.toJSON();
	if (!userData) {
		return new NextResponse('wrong token', { status: 401 });
	}
	return NextResponse.json({ data: userData });
}
