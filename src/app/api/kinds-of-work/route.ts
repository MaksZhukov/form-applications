import { initialize } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	const { KindsOfWorkModel } = await initialize();
	try {
		const data = await KindsOfWorkModel.findAll();
		return NextResponse.json({ data });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting kinds of work: ${err.message}`, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const {
		data: { name }
	} = await request.json();
	const { KindsOfWorkModel } = await initialize();
	try {
		const kindOfWork = await KindsOfWorkModel.create({ name });
		return NextResponse.json({ data: kindOfWork });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with creating application: ${err.message}`, { status: 500 });
	}
}
