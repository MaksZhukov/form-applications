'use client';

import { Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNewApplicationId } from '../../api/applications/new';
import Application from '../../_components/Application';
import Layout from '../../_components/BaseLayout';

const ApplicationPage = () => {
	const router = useRouter();
	const { data, isLoading } = useQuery({ queryKey: [], queryFn: () => fetchNewApplicationId('common') });
	const handleCancel = () => {
		router.push('/');
	};

	if (isLoading) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}

	return <Application newApplicationId={data?.data.data} onCancel={handleCancel} data={null}></Application>;
};

export default ApplicationPage;
