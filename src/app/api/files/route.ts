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
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
	if (!applicationId) {
		return new NextResponse('no applicationId', { status: 400 });
	}
	const { ApplicationModel, ApplicationInternalModel } = await initialize();
	let organizationId: number;
	let role: Role;
	try {
		const res = await verify(token);
		role = res.payload.role as Role;
		organizationId = res.payload.organizationId as number;
	} catch (err) {
		return new NextResponse('wrong token', { status: 401 });
	}
	try {
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		const application = await Model.findOne({
			where: { id: applicationId, organizationId: organizationId }
		});
		const files = (await application?.getFiles()) || [];
		return NextResponse.json({ data: files });
	} catch (err) {}
}

export async function POST(request: NextRequest) {
	const applicationId = request.nextUrl.searchParams.get('applicationId');
	const applicationType = request.nextUrl.searchParams.get('applicationType') || 'common';
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
					const fileName = slugify(Date.now().toString(36) + '-' + item.name, { lower: true, strict: false });
					await fs.promises.writeFile(`uploads/${fileName}`, Buffer.from(await item.arrayBuffer()));
					return { type: item.type, name: fileName };
				})
			);
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(`Error with uploading: ${err.message}`, { status: 500 });
		}
		const { FileModel, ApplicationModel, ApplicationInternalModel } = await initialize();
		const Model = applicationType === 'common' ? ApplicationModel : ApplicationInternalModel;
		//@ts-expect-error error
		const application = await Model.findByPk(applicationId);
		const createdFiles = await FileModel.bulkCreate(filesData);
		await application?.addFiles(createdFiles);
		return NextResponse.json({ data: createdFiles });
	}
}
