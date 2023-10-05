'use client';

import { Spinner } from '@material-tailwind/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchApplication } from '../../api/applications/[id]';
import { ApiResponse } from '../../api/types';
import { ApplicationAttributes } from '@/db/application/types';
import Chat from '../../components/Chat';
import ApplicationInternal from '@/app/components/ApplicationInternal';
import { ApplicationInternalAttributes } from '@/db/applicationInternal/types';

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

	const handleCancel = () => {
		router.push('/');
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
		<>
			<ApplicationInternal
				data={data?.data || null}
				onCancel={handleCancel}
				onUpdated={handleUpdated}></ApplicationInternal>
			{process.env.NEXT_PUBLIC_FF_COMMENTS === 'true' && data && <Chat applicationId={data.data.id}></Chat>}
		</>
	);
}
