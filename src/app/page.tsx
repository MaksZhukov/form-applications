'use client';
import { API_LIMIT_ITEMS } from '@/constants';
import { Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchApplications } from './api/applications';
import { ApiApplication } from './api/applications/types';
import { fetchUser } from './api/user';
import Application from './components/Application';
import Table from './components/Table';

export default function Home() {
	const router = useRouter();
	const [isApplication, setIsApplication] = useState<boolean>(false);
	const [applicationData, setApplicationData] = useState<ApiApplication | null>(null);
	const [page, setPage] = useState(1);
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['application', page],
		staleTime: Infinity,
		retry: 0,
		keepPreviousData: true,
		queryFn: () => fetchApplications((page - 1) * API_LIMIT_ITEMS)
	});

	const {
		data: userData,
		isError,
		error,
		isLoading: isLoadingUser
	} = useQuery({
		queryKey: ['user'],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUser()
	});

	useEffect(() => {
		//@ts-expect-error error
		if (error?.response.status === 401) {
			router.replace('/login');
		}
	}, [error, router]);

	const handleClickMore = (item: ApiApplication) => {
		setApplicationData(item);
		setIsApplication(true);
	};
	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};
	const handleNewApplication = () => {
		setIsApplication(true);
	};

	const handleClose = () => {
		setIsApplication(false);
		setApplicationData(null);
	};

	const handleCreated = () => {
		refetch();
	};

	const handleClickLogo = () => {
		setIsApplication(false);
		setApplicationData(null);
	};

	if (isLoadingUser || isError) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-4'>
			<header className='flex justify-between mb-10'>
				<Image
					className='cursor-pointer'
					onClick={handleClickLogo}
					src={'/logo.png'}
					width={200}
					height={29}
					alt='Logo'></Image>
				<span className='flex'>
					Добро пожаловать
					<span className='text-blue-500 font-bold pl-2'>
						{isLoadingUser ? <Spinner /> : userData?.data.data.email}
					</span>
				</span>
			</header>

			{isApplication ? (
				<Application
					applicationNumber={data?.data.data.length ? data?.data?.data[0].id + 1 : 1}
					data={applicationData}
					onCreated={handleCreated}
					onClose={handleClose}></Application>
			) : isLoading ? (
				<div>
					<Spinner className='h-12 w-12 mx-auto'></Spinner>
				</div>
			) : (
				data && (
					<>
						{' '}
						<Button className='mb-4 bg-accent' onClick={handleNewApplication}>
							Новая задача
						</Button>
						<Table
							data={data.data.data}
							total={data.data.meta.total}
							onChangePage={handleChangePage}
							onClickMore={handleClickMore}
							page={page}></Table>
					</>
				)
			)}
		</div>
	);
}
