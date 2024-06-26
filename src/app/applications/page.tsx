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
import Table from '../_components/Table';
import {
	getLoginTime,
	getSelectedOrganizationId,
	getSelectedResponsibleUserId,
	getSelectedStatus,
	saveSelectedOrganizationId,
	saveSelectedResponsibleUserId,
	saveSelectedStatus
} from '../localStorage';
import { AutocompleteItem } from '../_components/common/Autocomplete/types';

export default function Applications() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [page, setPage] = useState(1);
	const selectedStatus = (searchParams.get('selectedStatus') || getSelectedStatus() || 'none') as
		| ApplicationStatus
		| 'none';

	const selectedOrganizationId = searchParams.get('selectedOrganizationId') || getSelectedOrganizationId() || 'none';
	const selectedResponsibleUserId =
		searchParams.get('selectedResponsibleUserId') || getSelectedResponsibleUserId() || 'none';

	// IT NEEDS FOR CSR
	useEffect(() => {}, []);
	const { data, isLoading } = useQuery({
		queryKey: [
			'applications',
			getLoginTime(),
			page,
			selectedStatus,
			selectedOrganizationId,
			selectedResponsibleUserId
		],
		staleTime: Infinity,
		retry: 0,
		keepPreviousData: true,
		queryFn: () =>
			fetchApplications<'common'>(
				(page - 1) * API_LIMIT_ITEMS,
				'common',
				selectedStatus === 'none' ? undefined : selectedStatus,
				selectedOrganizationId === 'none' ? undefined : selectedOrganizationId,
				selectedResponsibleUserId === 'none' ? undefined : selectedResponsibleUserId
			)
	});

	const { data: userData } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const isAdmin = userData?.data.role === 'admin';
	const isOwnerOrganizationWorker =
		userData?.data?.organization.id === +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID;

	const { data: organizations } = useQuery({
		queryKey: ['organizations', getLoginTime()],
		staleTime: Infinity,
		enabled: isAdmin || isOwnerOrganizationWorker,
		retry: 0,
		queryFn: () => fetchOrganizations()
	});

	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};

	const handleChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('selectedStatus', e.target.value as ApplicationStatus | 'none');
		router.push('/applications?' + params.toString());
		saveSelectedStatus(e.target.value);
	};

	const handleChangeOrganization = (item: string) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('selectedOrganizationId', item);
		router.push('/applications?' + params.toString());
		saveSelectedOrganizationId(item);
	};

	const handleChangeResponsibleUser: ChangeEventHandler<HTMLSelectElement> = (e) => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('selectedResponsibleUserId', e.target.value as string | 'none');
		router.push('/applications?' + params.toString());
		saveSelectedResponsibleUserId(e.target.value);
	};

	const handleClickNew = () => {
		router.push(`/applications/new`);
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
					Новая задача
				</Button>
				<Table
					applicationType='common'
					organizations={organizations?.data}
					selectedOrganizationId={selectedOrganizationId}
					selectedStatus={selectedStatus}
					selectedResponsibleUserId={selectedResponsibleUserId}
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
