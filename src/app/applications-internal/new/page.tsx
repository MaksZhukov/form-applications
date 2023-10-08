'use client';

import { Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNewApplicationId } from '../../api/applications/new';
import ApplicationInternal from '@/app/components/ApplicationInternal';

const ApplicationPage = () => {
	const router = useRouter();
	const { data, isLoading } = useQuery({ queryKey: [], queryFn: () => fetchNewApplicationId('internal') });
	const handleCancel = () => {
		router.push('/applications-internal');
	};

	if (isLoading) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}

	return (
		<ApplicationInternal newApplicationId={data?.data.data} onCancel={handleCancel} data={null}></ApplicationInternal>
	);
};

export default ApplicationPage;
