'use client';
import { API_LIMIT_ITEMS } from '@/constants';
import { Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchApplications } from './api/applications';
import { ApiApplication } from './api/applications/types';
import { fetchUser } from './api/user';
import ApplicationModal from './components/ApplicationModal';
import Table from './components/Table/Table';

export default function Home() {
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [applicationData, setApplicationData] = useState<ApiApplication | null>(null);
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery({
		queryKey: ['application', page],
		staleTime: Infinity,
		keepPreviousData: true,
		queryFn: () => fetchApplications((page - 1) * API_LIMIT_ITEMS)
	});
	const { data: user, isLoading: isLoadingUser } = useQuery({
		queryKey: ['user'],
		staleTime: Infinity,
		queryFn: () => fetchUser()
	});

	const handleSave = (data: ApiApplication) => {
		setApplicationData(data);
	};
	const handleClickMore = (item: ApiApplication) => {
		setApplicationData(item);
		setIsOpenModal(true);
	};
	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};
	const handleNewApplication = () => {
		setIsOpenModal(true);
	};

	return (
		<div className='container mx-auto py-4'>
			<header className='flex justify-between mb-10'>
				<span>logo</span>{' '}
				<span className='flex'>
					Добро пожаловать
					<span className='text-blue-500 font-bold pl-2'>
						{isLoadingUser ? <Spinner /> : user?.data.email}
					</span>
				</span>
			</header>

			<Button className='mb-4' onClick={handleNewApplication}>
				Новая задача
			</Button>
			{isLoading ? (
				<div>
					<Spinner className='h-12 w-12 mx-auto'></Spinner>
				</div>
			) : (
				data && (
					<Table
						data={data.data}
						total={data.meta.total}
						onChangePage={handleChangePage}
						onClickMore={handleClickMore}
						page={page}></Table>
				)
			)}
			{isOpenModal && <ApplicationModal data={applicationData} onSave={handleSave}></ApplicationModal>}
		</div>
	);
}
