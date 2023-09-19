import { initialize } from '@/db';
import { Role } from '@/db/organization/types';
import { verify } from '@/services/jwt';
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const applicationId = request.nextUrl.searchParams.get('applicationId');
	if (!applicationId) {
		return new NextResponse('no applicationId', { status: 400 });
	}
	const { CommentModel } = await initialize();
	let id: number;
	let role: Role;
	try {
		const res = await verify(token);
		id = res.payload.id as number;
		role = res.payload.role as Role;
	} catch (err) {
		return new NextResponse('wrong token', { status: 401 });
	}
	try {
		const data = await CommentModel.findAll({
			where: { applicationId }
		});
		return NextResponse.json({ data });
	} catch (err) {
		console.log(err);
		return new NextResponse('Error getting comments', { status: 500 });
	}
}
