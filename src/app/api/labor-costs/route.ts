import { initialize } from '@/db';
import { UserModel } from '@/db/users/model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const applicationId = request.nextUrl.searchParams.get('applicationId') as string;
	const { ApplicationModel, KindsOfWorkModel, UserModel } = await initialize();
	try {
		const application = await ApplicationModel.findByPk(+applicationId);
		const laborCosts = application
			? await application.getLaborCosts({
					include: [
						{ as: 'kindsOfWork', model: KindsOfWorkModel },
						{ as: 'employee', model: UserModel, attributes: ['id', 'name'] }
					]
			  })
			: [];

		return NextResponse.json({ data: laborCosts });
	} catch (err) {
		//@ts-expect-error error
		return new NextResponse(`Error getting kinds of work: ${err.message}`, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	const applicationId = request.nextUrl.searchParams.get('applicationId') as string;
	const formData = await request.formData();
	const date = formData.get('date') as string;
	const employeeId = formData.get('employeeId') as string;
	const kindsOfWorkId = formData.get('kindsOfWorkId') as string;
	const timeSpent = formData.get('timeSpent') as string;
	const description = formData.get('description') as string;

	const { LaborCostsModel, ApplicationModel, KindsOfWorkModel } = await initialize();
	try {
		const [application, laborCost] = await Promise.all([
			ApplicationModel.findByPk(+applicationId),
			LaborCostsModel.create(
				{
					date,
					employeeId: +employeeId,
					kindsOfWorkId: +kindsOfWorkId,
					timeSpent,
					description
				},
				{
					include: [
						{ as: 'kindsOfWork', model: KindsOfWorkModel },
						{ as: 'employee', model: UserModel, attributes: ['id', 'name'] }
					]
				}
			)
		]);
		application?.addLaborCosts([laborCost]);

		return NextResponse.json({ data: laborCost });
	} catch (err) {
		console.log(err);
		//@ts-expect-error error
		return new NextResponse(`Error with creating application: ${err.message}`, { status: 500 });
	}
}
