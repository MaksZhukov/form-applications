'use client';

import { Spinner } from '@material-tailwind/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchApplication } from '../../api/applications/[id]';
import { ApiResponse } from '../../api/types';
import ApplicationInternal from '@/app/_components/ApplicationInternal';
import { ApplicationInternalAttributes } from '@/db/applicationInternal/types';
import { getLoginTime } from '@/app/localStorage';
import { fetchUsers } from '@/app/api/users';

export default function ApplicationPage() {
	const { id } = useParams();
	const router = useRouter();
	const client = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: [id],
		queryFn: () => fetchApplication<'internal'>(+id, 'internal'),
		retry: 0,
		staleTime: Infinity
	});

	useQuery({
		queryKey: ['employees', getLoginTime(), 'isActive'],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUsers({ organizationId: +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID, isActive: true })
	});

	const handleCancel = () => {
		router.push('/applications-internal');
	};
	const handleUpdated = (updatedData: ApplicationInternalAttributes) => {
		client.setQueryData<ApiResponse<ApplicationInternalAttributes>>([id], (currData) =>
			currData ? { ...currData, data: updatedData } : currData
		);
	};
	if (isLoading) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}
	return (
		<ApplicationInternal
			data={data?.data || null}
			onCancel={handleCancel}
			onUpdated={handleUpdated}></ApplicationInternal>
	);
}
