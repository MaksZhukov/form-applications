'user client';

import { fetchOrganization } from '@/app/api/organization';
import { getLoginTime } from '@/app/localStorage';
import { API_LIMIT_ITEMS } from '@/constants';
import { ApplicationAttributes, ApplicationStatus } from '@/db/application/types';
import { OrganizationAttributes } from '@/db/organization/types';

import { Button, ButtonGroup, IconButton, Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC } from 'react';

interface Props {
	data: (ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'email' | 'name' | 'uid'> })[];
	organizations?: Pick<OrganizationAttributes, 'id' | 'name'>[];
	total?: number;
	page: number;
	selectedStatus: ApplicationStatus | 'none';
	selectedOrganizationId: string | 'none';
	onChangeStatus: (e: ChangeEvent<HTMLSelectElement>) => void;
	onChangeOrganization: (e: ChangeEvent<HTMLSelectElement>) => void;
	onChangePage: (page: number) => () => void;
}

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
	const { data: organizationData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchOrganization
	});
	const isAdmin = organizationData?.data.role === 'admin';
	const router = useRouter();
	const handleClickMore = (item: ApplicationAttributes) => () => {
		router.push(`/${item.id}`);
	};

	const countPages = Math.ceil(total / API_LIMIT_ITEMS);

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
								className='mt-1 border border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
								<option value='none'>Не выбрано</option>
								{organizations.map((item) => (
									<option key={item.id} value={item.id}>
										{item.name}
									</option>
								))}
							</select>
						)
					},
					{ name: 'Дедлайн' }
			  ]
			: []),
		{
			name: 'Статус',
			filter: isAdmin && (
				<select
					value={selectedStatus}
					onChange={onChangeStatus}
					className='mt-1 border border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
					<option value='none'>Не выбрано</option>
					<option value='В обработке'>В обработке</option>
					<option value='В работе'>В работе</option>
					<option value='Выполнена'>Выполнена</option>
				</select>
			)
		},
		{ name: 'Срочность' },
		{ name: '' }
	];

	return (
		<>
			<table className='w-full min-w-max table-auto text-left'>
				<thead>
					<tr>
						{TABLE_HEAD.map((head) => (
							<th key={head.name} className='border-b border-gray-100 p-3'>
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
										{item.createdAt}
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
								{isAdmin && (
									<td className={classes}>
										<Typography variant='small' className='font-normal'>
											{item.deadline}
										</Typography>
									</td>
								)}
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.status}
									</Typography>
								</td>
								<td className={classes}>
									{item.isUrgent ? <div className='w-6 h-6 bg-accent rounded-full'></div> : ''}
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
						{new Array(countPages).fill(null).map((item, index) => (
							<IconButton
								key={index + 1}
								className={page === index + 1 ? 'bg-blue-100 text-blue-gray-900' : ''}
								onClick={onChangePage(index + 1)}>
								{index + 1}
							</IconButton>
						))}
					</ButtonGroup>
				)}
			</div>
		</>
	);
};

export default Table;
