import { DATE_PATTERN } from '@/app/constants';
import { cacheStore, getDataFromCacheStore, setDataToCacheStore } from '@/services/cacheStore/cacheStore';
import { getApplication, updateApplication } from '@/services/db/applications/applications';
import { Application } from '@/services/db/applications/types';
import { getFilesByApplicationIDs } from '@/services/db/files/files';
import { UserRole } from '@/services/db/users/types';
import { verify } from '@/services/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const id = parseInt(request.nextUrl.pathname.split('/')[3]);
	const token = request.cookies.get('token')?.value as string;
	const cache = getDataFromCacheStore(token + request.nextUrl.href);
	if (cache) {
		console.log(`CACHE HIT ON ROUTE: ${request.nextUrl.href}`);
		return NextResponse.json(cache);
	}
	try {
		const {
			payload: { id: userID, role }
		} = await verify(token);
		const data = (await getApplication(id, userID as number, role as UserRole)) as Application[];
		if (data[0]) {
			const files = await getFilesByApplicationIDs([data[0].id]);
			const result = { data: { ...data[0], files } };
			setDataToCacheStore(token + request.nextUrl.href, result);
			return NextResponse.json(result);
		} else {
			return new NextResponse(`not found`, { status: 400 });
		}
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting applications: ${err.message}`, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	const id = parseInt(request.nextUrl.pathname.split('/')[3]);
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const status = formData.get('status') as string;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;
	const comment = formData.get('comment') as string;
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	if (!title || !description || !date || !deadline || !phone) {
		return new NextResponse('required fields', { status: 400 });
	}

	if (!date.match(DATE_PATTERN) || !deadline.match(DATE_PATTERN)) {
		return new NextResponse('validate fields', { status: 400 });
	}

	try {
		await updateApplication(id, {
			title,
			description,
			date,
			deadline,
			phone,
			comment,
			status,
			name,
			email
		});
		cacheStore.clear();
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with updating application: ${err.message}`, { status: 500 });
	}
	return new NextResponse(``, { status: 200 });
}
