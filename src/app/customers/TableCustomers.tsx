import { Button, Spinner, Typography } from '@material-tailwind/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '../localStorage';
import { fetchUsers } from '../api/users';
import { useState } from 'react';
import { API_LIMIT_ITEMS } from '@/constants';
import Pagination from '../components/Pagination';
import { useSearchParams } from 'next/navigation';

const TABLE_HEAD = [
	{ name: 'Название', width: 400 },
	{ name: 'Телефон' },
	{ name: 'Электронная почта' },
	{ name: 'Ответственный за компанию' },
	{ name: 'Дата создания' },
	{ name: 'Адрес' },
	{ name: '', width: 120 }
];

const TableCustomers = () => {
	const searchParams = useSearchParams();
	const [page, setPage] = useState(1);
	const search = searchParams.get('search') || '';
	const client = useQueryClient();
	console.log({ onlyCustomers: true, offset: (page - 1) * API_LIMIT_ITEMS });
	const { data, isLoading } = useQuery({
		queryKey: ['customers', page, search, getLoginTime()],
		retry: 0,
		keepPreviousData: true,
		staleTime: Infinity,
		queryFn: () =>
			fetchUsers({
				onlyCustomers: true,
				offset: (page - 1) * API_LIMIT_ITEMS,
				search
			})
	});

	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};

	const customers = data?.data || [];

	const countPages = Math.ceil((data?.meta?.total || 1) / API_LIMIT_ITEMS);

	if (isLoading) {
		return (
			<div>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}

	return (
		<>
			<table className='w-full table-auto text-left'>
				<thead>
					<tr>
						{TABLE_HEAD.map((head) => (
							<th key={head.name} style={{ width: head.width }} className='border-b border-gray-100 p-3'>
								<Typography variant='small' className='font-bold leading-none opacity-90'>
									{head.name}
								</Typography>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{customers.map((item, index) => {
						const isLast = index === customers.length - 1;
						const classes = isLast ? 'p-3 align-baseline' : 'p-3 border-b border-accent align-baseline';

						return (
							<tr key={item.id}>
								<td className={classes}>{item.organization.name}</td>
								<td className={classes}>{item.phone}</td>
								<td className={classes}>{item.email}</td>
								<td className={classes}>RESPONSIBLE USER</td>
								<td className={classes}>
									{new Date(item.organization.createdAt).toLocaleDateString()}
								</td>
								<td className={classes}>{item.organization.address}</td>
								<td className={classes}>
									<Button
										variant='outlined'
										className='border-accent text-accent w-[165px]'
										onClick={() => {}}>
										Изменить
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Pagination page={page} countPages={countPages} onChangePage={handleChangePage} />
		</>
	);
};

export default TableCustomers;
