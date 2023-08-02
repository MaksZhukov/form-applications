import { cacheStore } from '@/services/cacheStore/cacheStore';
import { createApplication, getApplications } from '@/services/db/applications/applications';
import { Application } from '@/services/db/applications/types';
import { createFiles, getFiles } from '@/services/db/files/files';
import { File } from '@/services/db/files/types';
import { UserRole } from '@/services/db/users/types';
import { getBearerToken, verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { ApiApplication } from './types';

export async function GET(request: NextRequest) {
	const cache = cacheStore.get(request.nextUrl.href);
	if (cache) {
		console.log(`CACHE HIT ON ROUTE: ${request.nextUrl.href}`);
		return NextResponse.json(cache);
	}
	const limit = parseInt(request.nextUrl.searchParams.get('limit') || '') || 25;
	const offset = parseInt(request.nextUrl.searchParams.get('offset') || '') || 0;
	const token = getBearerToken(request) as string;
	if (limit > 25) {
		return new NextResponse("limit param isn't valid", { status: 400 });
	}
	try {
		const {
			payload: { id, role }
		} = await verify(token);
		const { data, meta } = await getApplications(
			{ userId: id as number, userRole: role as UserRole },
			{ limit, offset }
		);

		const ids = (data as Application[]).map((item) => item.id);
		const files = await getFiles(ids);
		const dataWithFiles: ApiApplication[] = (data as Application[]).map((item) => ({
			...item,
			files: (files as File[])
				.filter((file) => file.application_id === item.id)
				.map(({ id, name }) => ({ id, name }))
		}));
		const result = { data: dataWithFiles, meta };
		cacheStore.set(request.nextUrl.href, result);
		return NextResponse.json(result);
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting applications: ${err.message}`, { status: 500 });
	}
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

	const files = Array.from(formData.values()).filter((item) => typeof item === 'object') as Blob[];

	if (!title || !description || !date || !deadline || !phone || !comment) {
		return new NextResponse('required fields', { status: 400 });
	}
	let applicationId;
	try {
		const { insertId } = (await createApplication({
			title,
			description,
			date,
			deadline,
			phone,
			comment,
			user_id: id as number
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
		let fileNames = [];
		try {
			fileNames = await Promise.all(
				files.map(async (item) => {
					const fileName = Date.now().toString(36) + '-' + item.name;
					await fs.promises.writeFile(`public/uploads/${fileName}`, Buffer.from(await item.arrayBuffer()));
					return fileName;
				})
			);
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`Error with uploading: ${err.message}`, { status: 500 });
		}

		try {
			await createFiles(applicationId, fileNames);
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`Error with inserting files: ${err.message}`, { status: 500 });
		}
	}
	cacheStore.clear();
	return new NextResponse(``, { status: 200 });
}
