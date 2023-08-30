import { initialize } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	if (!token) {
		return new NextResponse('no token', { status: 401 });
	}
	try {
		const { ApplicationModel } = await initialize();
		const items = await ApplicationModel.findAll({ order: [['id', 'DESC']], limit: 1 });
		return NextResponse.json({ data: items.length ? items[0].toJSON().id + 1 : 1 });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting new app id: ${err.message}`, { status: 500 });
	}
}
