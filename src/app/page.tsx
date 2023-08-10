'use client';

import { API_LIMIT_ITEMS } from '@/constants';
import { ApplicationStatus } from '@/services/db/applications/types';
import { Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { fetchApplications } from './api/applications';
import { fetchUser } from './api/user';
import { fetchUsers } from './api/users';
import Layout from './components/Layout';
import Table from './components/Table';
import { getLoginTime } from './localStorage';

export default function Home() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'none'>('none');
	const [selectedOrganization, setSelectedOrganization] = useState<string | 'none'>('none');
	const { data, isLoading } = useQuery({
		queryKey: ['application', getLoginTime(), page, selectedStatus, selectedOrganization],
		staleTime: Infinity,
		retry: 0,
		keepPreviousData: true,
		queryFn: () =>
			fetchApplications(
				(page - 1) * API_LIMIT_ITEMS,
				selectedStatus === 'none' ? undefined : selectedStatus,
				selectedOrganization === 'none' ? undefined : selectedOrganization
			)
	});

	const { data: userData } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUser()
	});

	const isAdmin = userData?.data.data.role === 'admin';

	const { data: usersData } = useQuery({
		queryKey: ['users', getLoginTime()],
		staleTime: Infinity,
		enabled: isAdmin,
		retry: 0,
		queryFn: () => fetchUsers()
	});

	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};

	const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedStatus(e.target.value as ApplicationStatus | 'none');
	};

	const handleChangeOrganization = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedOrganization(e.target.value);
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
							users={usersData?.data.data}
							selectedOrganization={selectedOrganization}
							selectedStatus={selectedStatus}
							onChangeStatus={handleChangeStatus}
							onChangeOrganization={handleChangeOrganization}
							data={data.data.data}
							total={data.data.meta.total}
							onChangePage={handleChangePage}
							page={page}></Table>
					</>
				)
			)}
		</Layout>
	);
}
