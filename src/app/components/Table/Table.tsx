'user client';

import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import { API_LIMIT_ITEMS } from '@/constants';
import { ApplicationAttributes, ApplicationStatus } from '@/db/application/types';
import { OrganizationAttributes } from '@/db/organization/types';

import { Button, ButtonGroup, IconButton, Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import getConfig from 'next/config';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useState } from 'react';

const MAX_PART_PAGINATION = 10;

interface Props {
	data: (ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'name' | 'uid'> })[];
	organizations?: Pick<OrganizationAttributes, 'id' | 'name'>[];
	total?: number;
	page: number;
	selectedStatus: ApplicationStatus | 'none';
	selectedOrganizationId: string | 'none';
	onChangeStatus: (e: ChangeEvent<HTMLSelectElement>) => void;
	onChangeOrganization: (e: ChangeEvent<HTMLSelectElement>) => void;
	onChangePage: (page: number) => () => void;
}

const config = getConfig();

const Table: FC<Props> = ({
	data,
	total = 0,
	organizations = [],
	page,
	selectedOrganizationId,
	selectedStatus,
	onChangePage,
	onChangeOrganization,
	onChangeStatus
}) => {
	const { data: userData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});
	const isAdmin = userData?.data.role === 'admin';
	const router = useRouter();
	const handleClickMore = (item: ApplicationAttributes) => () => {
		router.push(`/${item.id}`);
	};
	const [partPagination, setPartPagination] = useState<number>(1);
	const countPages = Math.ceil(total / API_LIMIT_ITEMS);
	const countPagesByPart =
		MAX_PART_PAGINATION * partPagination > countPages
			? countPages - MAX_PART_PAGINATION * (partPagination - 1)
			: MAX_PART_PAGINATION;
	const maxPartPaginationCount = Math.ceil(countPages / MAX_PART_PAGINATION);

	const TABLE_HEAD = [
		{ name: '№' },
		{ name: 'Дата создания' },
		{ name: 'Наименование' },
		...(isAdmin
			? [
					{
						name: 'Организация',
						filter: (
							<select
								value={selectedOrganizationId}
								onChange={onChangeOrganization}
								className='mt-1 border font-normal border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
								<option value='none'>Не выбрано</option>
								{organizations.map((item) => (
									<option key={item.id} value={item.id}>
										{item.name}
									</option>
								))}
							</select>
						)
					}
			  ]
			: []),
		{ name: 'Дедлайн' },
		{
			name: 'Статус',
			width: 135,
			filter: isAdmin && (
				<select
					value={selectedStatus}
					onChange={onChangeStatus}
					className='mt-1 border border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 font-normal dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
					<option value='none'>Не выбрано</option>
					<option value='В обработке'>В обработке</option>
					<option value='В работе'>В работе</option>
					<option value='Выполнено'>Выполнено</option>
				</select>
			)
		},
		{ name: 'Срочность' },
		{ name: '' }
	];
	const handleChangePart = (value: number) => () => {
		setPartPagination(value);
	};

	return (
		<>
			<table className='w-full table-auto text-left'>
				<thead>
					<tr>
						{TABLE_HEAD.map((head) => (
							<th key={head.name} style={{ width: head.width }} className='border-b border-gray-100 p-3'>
								<Typography variant='small' className='font-bold leading-none opacity-90'>
									{head.name}
									{head.filter}
								</Typography>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((item, index) => {
						const isLast = index === data.length - 1;
						const classes = isLast ? 'p-3 align-baseline' : 'p-3 border-b border-accent align-baseline';

						return (
							<tr key={item.id}>
								<td className={classes}>AM-{item.id.toString().padStart(6, '0')}</td>
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{new Date(item.createdAt).toLocaleDateString()}
									</Typography>
								</td>
								<td className={classes + ' max-w-xs'}>
									<Typography variant='medium' className='font-normal'>
										{item.title}
									</Typography>
									<Typography className='font-normal text-xs'>
										Описание. {item.description}
									</Typography>
								</td>
								{isAdmin && (
									<td className={classes + ' max-w-xs'}>
										<Typography variant='medium' className='font-normal'>
											{item.organization.name}
										</Typography>
										<Typography className='font-normal text-xs'>
											УНП: {item.organization.uid}
										</Typography>
									</td>
								)}
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.deadline}
									</Typography>
								</td>

								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.status}
									</Typography>
								</td>
								<td className={classes + ' text-center'}>
									{item.isUrgent ? <div className='w-6 h-6 ml-6 bg-accent rounded-full'></div> : ''}
								</td>
								<td className={classes}>
									<Button
										variant='outlined'
										className='border-accent text-accent'
										onClick={handleClickMore(item)}>
										Подробнее
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className='w-full flex'>
				{countPages > 1 && (
					<ButtonGroup variant='outlined' className='mx-auto'>
						{partPagination > 1 && (
							<IconButton onClick={handleChangePart(partPagination - 1)}>...</IconButton>
						)}
						{new Array(countPagesByPart).fill(null).map((item, index) => {
							const currentPage = index + MAX_PART_PAGINATION * (partPagination - 1) + 1;
							return (
								<IconButton
									key={currentPage}
									className={
										page === currentPage
											? 'bg-blue-100 text-blue-gray-900'
											: index + 1 === countPagesByPart &&
											  partPagination === maxPartPaginationCount
											? 'border-r-1'
											: ''
									}
									onClick={onChangePage(currentPage)}>
									{currentPage}
								</IconButton>
							);
						})}
						{partPagination !== maxPartPaginationCount && (
							<IconButton onClick={handleChangePart(partPagination + 1)}>...</IconButton>
						)}
					</ButtonGroup>
				)}
			</div>
		</>
	);
};

export default Table;
