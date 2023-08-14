'use client';

import { API_LIMIT_ITEMS } from '@/constants';

import { ApplicationStatus } from '@/db/application/types';
import { Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { fetchApplications } from './api/applications';
import { fetchOrganization } from './api/organization';
import { fetchOrganizations } from './api/organizations';
import Layout from './components/Layout';
import Table from './components/Table';
import { getLoginTime } from './localStorage';
import { GetStaticProps } from 'next';

export default function Home() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'none'>('none');
	const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | 'none'>('none');
	// IT NEEDS FOR CSR
	useEffect(() => {}, []);
	const { data, isLoading } = useQuery({
		queryKey: ['application', getLoginTime(), page, selectedStatus, selectedOrganizationId],
		staleTime: Infinity,
		retry: 0,
		keepPreviousData: true,
		queryFn: () =>
			fetchApplications(
				(page - 1) * API_LIMIT_ITEMS,
				selectedStatus === 'none' ? undefined : selectedStatus,
				selectedOrganizationId === 'none' ? undefined : selectedOrganizationId
			)
	});

	const { data: organizationData } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchOrganization
	});

	const isAdmin = organizationData?.data.role === 'admin';

	const { data: organizations } = useQuery({
		queryKey: ['users', getLoginTime()],
		staleTime: Infinity,
		enabled: isAdmin,
		retry: 0,
		queryFn: fetchOrganizations
	});

	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};

	const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedStatus(e.target.value as ApplicationStatus | 'none');
	};

	const handleChangeOrganization = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedOrganizationId(e.target.value);
	};

	const handleClickNew = () => {
		router.push(`/new`);
	};

	return (
		<Layout>
			{isLoading ? (
				<div>
					<Spinner className='h-12 w-12 mx-auto'></Spinner>
				</div>
			) : (
				data && (
					<>
						{' '}
						<Button className='mb-4 bg-accent' onClick={handleClickNew}>
							Новая задача
						</Button>
						<Table
							organizations={organizations?.data.data}
							selectedOrganizationId={selectedOrganizationId}
							selectedStatus={selectedStatus}
							onChangeStatus={handleChangeStatus}
							onChangeOrganization={handleChangeOrganization}
							data={data.data.data}
							total={data.data.meta?.total}
							onChangePage={handleChangePage}
							page={page}></Table>
					</>
				)
			)}
		</Layout>
	);
}

export const getStaticProps = async () => {
	return { props: {} };
};
