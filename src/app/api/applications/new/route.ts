import { initialize } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const { ApplicationModel } = await initialize();
		const items = await ApplicationModel.findAll({ order: [['id', 'DESC']], limit: 1 });
		return NextResponse.json({ data: items.length ? items[0].toJSON().id + 1 : 1 });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting new app id: ${err.message}`, { status: 500 });
	}
}
