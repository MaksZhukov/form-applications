import { initialize } from '@/db';
import { FileAttributesCreation } from '@/db/file/types';
import { Role } from '@/db/organization/types';
import { verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const applicationId = request.nextUrl.searchParams.get('applicationId');
	if (!applicationId) {
		return new NextResponse('no applicationId', { status: 400 });
	}
	const { FileModel, ApplicationModel } = await initialize();
	let id: number;
	let role: Role;
	try {
		const res = await verify(token);
		id = res.payload.id as number;
		role = res.payload.role as Role;
	} catch (err) {
		return new NextResponse('wrong token', { status: 401 });
	}
	try {
		const data = await FileModel.findAll({
			where: { applicationId, '$application.organizationId$': id },
			attributes: { exclude: ['applicationId'] },
			include: { model: ApplicationModel, attributes: [] }
		});
		return NextResponse.json({ data });
	} catch (err) {}
}

export async function POST(request: NextRequest) {
	const applicationId = request.nextUrl.searchParams.get('applicationId');
	if (!applicationId) {
		return new NextResponse(`no applicationId`, { status: 500 });
	}
	const formData = await request.formData();
	const files = Array.from(formData.values()).filter((item) => typeof item === 'object') as Blob[];

	if (files.length) {
		let filesData: FileAttributesCreation[] = [];
		if (files.every((item) => item.size > 5000000)) {
			return new NextResponse('file it too large max 5mb', { status: 400 });
		}
		if (files.length > 10) {
			return new NextResponse('files more than 10', { status: 400 });
		}
		try {
			filesData = await Promise.all(
				files.map(async (item) => {
					const fileName = slugify(Date.now().toString(36) + '-' + item.name, { lower: true, strict: true });
					await fs.promises.writeFile(`uploads/${fileName}`, Buffer.from(await item.arrayBuffer()));
					return { type: item.type, name: fileName, applicationId: +applicationId };
				})
			);
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`Error with uploading: ${err.message}`, { status: 500 });
		}
		const { FileModel } = await initialize();
		const data = await FileModel.bulkCreate(filesData);
		return NextResponse.json({ data });
	}
}
