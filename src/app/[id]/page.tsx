'use client';

import { Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchApplication } from '../api/applications/[id]';
import Application from '../components/Application';
import Layout from '../components/Layout';

const ApplicationPage = () => {
	const { id } = useParams();
	const router = useRouter();
	const { data, isLoading, refetch } = useQuery({
		queryKey: [id],
		queryFn: () => fetchApplication(+id),
		retry: 0,
		staleTime: Infinity
	});
	const handleCancel = () => {
		router.push('/');
	};
	const handleUpdated = () => {
		refetch();
	};
	if (isLoading) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}
	return (
		<Layout>
			<Application data={data?.data.data || null} onCancel={handleCancel} onUpdated={handleUpdated}></Application>
		</Layout>
	);
};

export default ApplicationPage;
