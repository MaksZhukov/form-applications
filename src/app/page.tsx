'use client';

import { API_LIMIT_ITEMS } from '@/constants';
import { Button, Spinner } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchApplications } from './api/applications';
import Layout from './components/Layout';
import Table from './components/Table';
import { getLoginTime } from './localStorage';

export default function Home() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery({
		queryKey: ['application', getLoginTime(), page],
		staleTime: Infinity,
		retry: 0,
		keepPreviousData: true,
		queryFn: () => fetchApplications((page - 1) * API_LIMIT_ITEMS)
	});

	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
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
