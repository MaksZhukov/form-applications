import { initialize } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	try {
		const { OrganizationModel } = await initialize();
		const organizations = await OrganizationModel.findAll({ attributes: ['id', 'name', 'createdAt', 'address'] });
		return NextResponse.json({ data: organizations });
	} catch (err) {
		console.log(err);
		return new NextResponse('error getting users', { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const uid = formData.get('uid') as string;
	const name = formData.get('name') as string;
	const address = (formData.get('address') as string) || '';
	try {
		const { OrganizationModel } = await initialize();
		await OrganizationModel.create({
			name,
			address,
			uid
		});
	} catch (err) {
		if (err instanceof Error) {
			return new NextResponse(err.message, { status: 500 });
		}
	}
	return new NextResponse('success', { status: 200 });
}
