import { getNewApplicationId } from '@/services/db/applications/applications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const data = (await getNewApplicationId()) as [{ id: number }];
		return NextResponse.json({ data: data.length ? data[0].id + 1 : 1 });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting new app id: ${err.message}`, { status: 500 });
	}
}
