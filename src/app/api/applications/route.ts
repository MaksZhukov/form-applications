import { DATE_PATTERN } from '@/app/constants';
import { API_LIMIT_ITEMS } from '@/constants';
import { cacheStore, getDataFromCacheStore, setDataToCacheStore } from '@/services/cacheStore/cacheStore';
import { createApplication, getApplications } from '@/services/db/applications/applications';
import { createApplicationsFiles } from '@/services/db/applicationsFiles/applicationsFiles';
import { createFiles } from '@/services/db/files/files';
import { UserRole } from '@/services/db/users/types';
import { verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const cache = getDataFromCacheStore(token + request.nextUrl.href);
	if (cache) {
		console.log(`CACHE HIT ON ROUTE: ${request.nextUrl.href}`);
		return NextResponse.json(cache);
	}
	const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || API_LIMIT_ITEMS;
	const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
	if (limit > API_LIMIT_ITEMS) {
		return new NextResponse("limit param isn't valid", { status: 400 });
	}
	try {
		const {
			payload: { id, role },
		} = await verify(token);
		const { data, meta } = await getApplications(
			{ userId: id as number, userRole: role as UserRole },
			{ limit, offset }
		);
		const result = { data, meta };
		setDataToCacheStore(token + request.nextUrl.href, result);
		return NextResponse.json(result);
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting applications: ${err.message}`, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const {
		payload: { id },
	} = await verify(request.cookies.get('token')?.value as string);
	const formData = await request.formData();
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;
	const comment = formData.get('comment') as string;
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	const files = Array.from(formData.values()).filter((item) => typeof item === 'object') as Blob[];

	if (!title || !description || !date || !deadline || !phone || !comment) {
		return new NextResponse('required fields', { status: 400 });
	}

	if (!date.match(DATE_PATTERN) || !deadline.match(DATE_PATTERN)) {
		return new NextResponse('validate fields', { status: 400 });
	}

	let applicationId;
	let filesIDS = [];
	try {
		const { insertId, ...rest } = (await createApplication({
			title,
			description,
			date,
			deadline,
			phone,
			comment,
			status: '',
			name,
			email,
			user_id: id as number,
		})) as any;
		applicationId = insertId;
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with creating application: ${err.message}`, { status: 500 });
	}
	if (files) {
		if (files.every((item) => item.size > 5000000)) {
			return new NextResponse('file it too large max 5mb', { status: 400 });
		}
		if (files.length > 10) {
			return new NextResponse('files more than 10', { status: 400 });
		}
		let filesData = [];
		try {
			filesData = await Promise.all(
				files.map(async (item) => {
					const fileName = Date.now().toString(36) + '-' + item.name;
					await fs.promises.writeFile(`uploads/${fileName}`, Buffer.from(await item.arrayBuffer()));
					return { type: item.type, name: fileName };
				})
			);
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`Error with uploading: ${err.message}`, { status: 500 });
		}
		try {
			const { insertId, affectedRows } = (await createFiles(filesData)) as any;
			filesIDS = new Array(affectedRows).fill(null).map((_, index) => insertId + index);
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`Error with inserting files: ${err.message}`, { status: 500 });
		}
	}
	try {
		await createApplicationsFiles(applicationId, filesIDS);
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with inserting applications and files: ${err.message}`, { status: 500 });
	}
	cacheStore.clear();
	return new NextResponse(``, { status: 200 });
}
