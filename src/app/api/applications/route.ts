import { createApplication, getApplications } from '@/services/db/applications/applications';
import { UserRole } from '@/services/db/users/types';
import { getBearerToken, verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || 25;
	const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
	const token = getBearerToken(request) as string;
	if (limit > 25) {
		return new NextResponse("limit param isn't valid", { status: 400 });
	}
	const {
		payload: { id, role }
	} = await verify(token);
	const { data, meta } = await getApplications(
		{ userId: id as number, userRole: role as UserRole },
		{ limit, offset }
	);
	return NextResponse.json({ data, meta });
}

export async function POST(request: NextRequest) {
	const {
		payload: { id }
	} = await verify(getBearerToken(request) as string);
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;
	const comment = formData.get('comment') as string;
	const file = formData.get('file') as Blob | null;

	let fileName = '';

	if (file) {
		if (file.size > 5000000) {
			return new NextResponse('file it too large max 5mb', { status: 400 });
		}
		fileName = new Date().toLocaleString().replaceAll(':', '.').replace(', ', '-') + '-' + file.name;
		try {
			await fs.promises.writeFile(`public/uploads/${fileName}`, Buffer.from(await file.arrayBuffer()));
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`issue with uploading: ${err.message}`, { status: 500 });
		}
	}

	if (!title || !description || !date || !deadline || !phone || !comment) {
		return new NextResponse('required fields', { status: 400 });
	}

	try {
		await createApplication({
			title,
			description,
			date,
			deadline,
			phone,
			comment,
			file: fileName,
			user_id: id as number
		});
		return new NextResponse('', { status: 200 });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(err.message, { status: 500 });
	}
}
