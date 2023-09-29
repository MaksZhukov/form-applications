import { API_LIMIT_ITEMS } from '@/constants';
import { initialize } from '@/db';
import { Role } from '@/db/organization/types';
import { verify } from '@/services/jwt';
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const applicationId = request.nextUrl.searchParams.get('applicationId');
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
	const offset = request.nextUrl.searchParams.get('offset') || '0';
	if (!applicationId) {
		return new NextResponse('no applicationId', { status: 400 });
	}
	const { CommentModel, ApplicationModel, ApplicationInternalModel, UserModel } = await initialize();
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
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		const application = await Model.findByPk(applicationId);
		const comments = application
			? await application.getComments({
					limit: API_LIMIT_ITEMS,
					offset: +offset,
					order: [['createdAt', 'DESC']],
					include: [{ model: UserModel, attributes: ['id', 'name'] }]
			  })
			: [];

		return NextResponse.json({
			data: comments
				.map((item) => item.toJSON())
				.map(({ id, text, createdAt, updatedAt, user, userId }) => ({
					id,
					text,
					createdAt,
					updatedAt,
					user,
					userId
				}))
				.reverse()
		});
	} catch (err) {
		console.log(err);
		return new NextResponse('Error getting comments', { status: 500 });
	}
}
