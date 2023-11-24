'use client';

import { API_LIMIT_ITEMS } from '@/constants';
import { ApplicationStatus } from '@/db/application/types';
import { Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, ChangeEventHandler, FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { fetchApplications } from '../api/applications';
import { fetchUser } from '../api/user';
import { fetchOrganizations } from '../api/organizations';
import Table from '../components/Table';
import { getLoginTime, getSelectedOrganizationId, saveSelectedOrganizationId } from '../localStorage';

export default function Applications() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [page, setPage] = useState(1);
	const selectedStatus = (searchParams.get('selectedStatus') || 'none') as ApplicationStatus | 'none';
	const selectedOrganizationId = searchParams.get('selectedOrganizationId') || getSelectedOrganizationId() || 'none';

	// IT NEEDS FOR CSR
	useEffect(() => {}, []);
	const { data, isLoading } = useQuery({
		queryKey: ['applications-internal', getLoginTime(), page, selectedStatus, selectedOrganizationId],
		staleTime: Infinity,
		retry: 0,
		keepPreviousData: true,
		queryFn: () =>
			fetchApplications<'internal'>(
				(page - 1) * API_LIMIT_ITEMS,
				'internal',
				selectedStatus === 'none' ? undefined : selectedStatus,
				selectedOrganizationId === 'none' ? undefined : selectedOrganizationId
			)
	});

	const { data: userData } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const isAdmin = userData?.data.role === 'admin';

	const { data: organizations } = useQuery({
		queryKey: ['organizations', getLoginTime()],
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
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('selectedStatus', e.target.value as ApplicationStatus | 'none');
		router.push('/applications-internal?' + params.toString());
	};

	const handleChangeOrganization = (e: ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('selectedOrganizationId', e.target.value as ApplicationStatus | 'none');
		router.push('/applications-internal?' + params.toString());
		saveSelectedOrganizationId(e.target.value);
	};

	const handleChangeResponsibleUser: ChangeEventHandler<HTMLSelectElement> = (e) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('selectedResponsibleUserId', e.target.value as string | 'none');
		router.push('/applications-internal?' + params.toString());
	};

	const handleClickNew = () => {
		router.push(`/applications-internal/new`);
	};

	return isLoading ? (
		<div>
			<Spinner className='h-12 w-12 mx-auto'></Spinner>
		</div>
	) : (
		data && (
			<>
				{' '}
				<Button className='mb-4 bg-accent' onClick={handleClickNew}>
					Новая внутренняя задача
				</Button>
				<Table
					applicationType='internal'
					organizations={organizations?.data.data}
					selectedOrganizationId={selectedOrganizationId}
					selectedStatus={(searchParams.get('selectedStatus') as ApplicationStatus) || 'none'}
					onChangeStatus={handleChangeStatus}
					onChangeOrganization={handleChangeOrganization}
					onChangeResponsibleUser={handleChangeResponsibleUser}
					data={data.data.data}
					total={data.data.meta?.total}
					onChangePage={handleChangePage}
					page={page}></Table>
			</>
		)
	);
}
