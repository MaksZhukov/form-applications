import { initialize } from '@/db';
import { Role } from '@/db/organization/types';
import { verify } from '@/services/jwt';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
	const token = request.cookies.get('token')?.value as string;
	const fileName = request.nextUrl.pathname.split('/')[3];
	let orgId: number;
	let role: string;
	try {
		const res = await verify(token);
		orgId = res.payload.id as number;
		role = res.payload.role as Role;
	} catch (err) {
		return new NextResponse('wrong token', { status: 401 });
	}
	if (orgId && role !== 'admin') {
		const { FileModel, ApplicationModel, OrganizationModel } = await initialize();
		try {
			const data = await FileModel.findOne({
				where: { name: fileName },
				include: { model: ApplicationModel, include: [OrganizationModel] }
			});
			if (!data) {
				throw new Error('no file');
			}
		} catch (err) {
			//@ts-expect-error error
			return new NextResponse(err.message, { status: 404 });
		}
	}

	return new NextResponse(await fs.promises.readFile(`./uploads/${fileName}`), { status: 200 });
}
