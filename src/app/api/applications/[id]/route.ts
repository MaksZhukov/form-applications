import { DATE_PATTERN } from '@/app/constants';
import { cacheStore, getDataFromCacheStore, setDataToCacheStore } from '@/services/cacheStore/cacheStore';
import { getApplication, updateApplication } from '@/services/db/applications/applications';
import { Application, ApplicationStatus } from '@/services/db/applications/types';
import { createApplicationsFiles } from '@/services/db/applicationsFiles/applicationsFiles';
import { createFiles, getFilesByApplicationIDs } from '@/services/db/files/files';
import { UserRole } from '@/services/db/users/types';
import { verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

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
	const status = formData.get('status') as ApplicationStatus;
	const description = formData.get('description') as string;
	const date = formData.get('date') as string;
	const deadline = formData.get('deadline') as string;
	const phone = formData.get('phone') as string;
	const comment = formData.get('comment') as string;
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;

	const files = Array.from(formData.values()).filter((item) => typeof item === 'object') as Blob[];
	console.log(title, description, date, phone, name);
	if (!title || !description || !date || !phone || !name) {
		return new NextResponse('required fields', { status: 400 });
	}

	if (!date.match(DATE_PATTERN) || (deadline && !deadline.match(DATE_PATTERN))) {
		return new NextResponse('validate fields', { status: 400 });
	}

	let filesIDS = [];
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
					const fileName = slugify(Date.now().toString(36) + '-' + item.name, { lower: true, strict: true });
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
		await createApplicationsFiles(id, filesIDS);
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error with inserting applications and files: ${err.message}`, { status: 500 });
	}
	cacheStore.clear();
	return new NextResponse(``, { status: 200 });
}
