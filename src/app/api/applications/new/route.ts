import { initialize } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
	if (!token) {
		return new NextResponse('no token', { status: 401 });
	}
	try {
		const { ApplicationModel, ApplicationInternalModel } = await initialize();
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		const items = await Model.findAll({ order: [['id', 'DESC']], limit: 1 });
		return NextResponse.json({ data: items.length ? items[0].toJSON().id + 1 : 1 });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting new app id: ${err.message}`, { status: 500 });
	}
}
