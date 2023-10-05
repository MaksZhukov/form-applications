'use client';

import { Spinner } from '@material-tailwind/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchApplication } from '../../api/applications/[id]';
import { ApiResponse } from '../../api/types';
import Application from '../../components/Application';
import { ApplicationAttributes } from '@/db/application/types';
import Chat from '../../components/Chat';

export default function ApplicationPage() {
	const { id } = useParams();
	const router = useRouter();
	const client = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: [id],
		queryFn: () => fetchApplication<'common'>(+id, 'common'),
		retry: 0,
		staleTime: Infinity
	});

	const handleCancel = () => {
		router.push('/');
	};
	const handleUpdated = (updatedData: ApplicationAttributes) => {
		client.setQueryData<ApiResponse<ApplicationAttributes>>([id], (currData) =>
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
			<Application data={data?.data || null} onCancel={handleCancel} onUpdated={handleUpdated}></Application>
			{process.env.NEXT_PUBLIC_FF_COMMENTS === 'true' && data && <Chat applicationId={data.data.id}></Chat>}
		</>
	);
}
