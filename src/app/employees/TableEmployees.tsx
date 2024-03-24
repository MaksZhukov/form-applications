import { Button, ButtonGroup, IconButton, Spinner, Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '../localStorage';
import { deleteUser, fetchUsers, updateUser } from '../api/users';
import { useState } from 'react';
import { API_LIMIT_ITEMS, MAX_PART_PAGINATION } from '@/constants';
import { UserAttributes } from '@/db/users/types';
import { ApiResponse } from '../api/types';
import { AxiosResponse } from 'axios';
import TrashIcon from '@/icons/trash.svg';

const nameByRole = {
	admin: 'админ',
	regular: 'обычный'
};

const TableEmployees = () => {
	const [partPagination, setPartPagination] = useState<number>(1);
	const [page, setPage] = useState(1);
	const handleChangePage = (newPage: number) => () => {
		setPage(newPage);
		window.scroll(0, 0);
	};
	const client = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ['employees', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUsers({ organizationId: +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID })
	});
	const updateUserMutation = useMutation({
		mutationFn: (params: { id: number; data: FormData }) => updateUser(params)
	});
	const deleteUserMutation = useMutation({
		mutationFn: (id: number) => deleteUser(id)
	});
	const employees = data?.data || [];

	const countPages = Math.ceil((data?.meta?.total || 1) / API_LIMIT_ITEMS);
	const countPagesByPart =
		MAX_PART_PAGINATION * partPagination > countPages
			? countPages - MAX_PART_PAGINATION * (partPagination - 1)
			: MAX_PART_PAGINATION;
	const maxPartPaginationCount = Math.ceil(countPages / MAX_PART_PAGINATION);

	const TABLE_HEAD = [
		{ name: 'Имя' },
		{ name: 'email' },
		{ name: 'Роль' },
		{ name: 'Отдел' },
		{ name: 'Статус', width: 120 },
		{ name: '', width: 170 },
		{ name: '', width: 50 }
	];

	const handleChangePart = (value: number) => () => {
		setPartPagination(value);
	};

	const handleClickDeactivate =
		(item: Pick<UserAttributes, 'id' | 'name' | 'departmentName' | 'email' | 'role' | 'isActive'>) => async () => {
			const formData = new FormData();
			formData.append('isActive', `${!item.isActive}`);
			updateUserMutation.mutateAsync({ id: item.id, data: formData });
			client.setQueryData<
				ApiResponse<Pick<UserAttributes, 'id' | 'name' | 'departmentName' | 'email' | 'role' | 'isActive'>[]>
			>(['employees', getLoginTime()], (prev) =>
				prev
					? {
							...prev,
							data: prev.data.map((el) => (el.id === item.id ? { ...el, isActive: !item.isActive } : el))
					  }
					: undefined
			);
		};

	const handleClickDelete = (id: number) => () => {
		if (window.confirm('Вы уверены?')) {
			deleteUserMutation.mutateAsync(id);
			client.setQueryData<
				ApiResponse<Pick<UserAttributes, 'id' | 'name' | 'departmentName' | 'email' | 'role' | 'isActive'>[]>
			>(['employees', getLoginTime()], (prev) =>
				prev
					? {
							...prev,
							data: prev.data.filter((item) => item.id !== id)
					  }
					: undefined
			);
		}
	};

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
					{employees.map((item, index) => {
						const isLast = index === employees.length - 1;
						const classes = isLast ? 'p-3 align-baseline' : 'p-3 border-b border-accent align-baseline';

						return (
							<tr key={item.id}>
								<td className={classes}>{item.name}</td>
								<td className={classes}>{item.email}</td>
								<td className={classes}>{nameByRole[item.role]}</td>
								<td className={classes}>{item.departmentName}</td>
								<td className={classes}>{item.isActive ? 'Активен' : 'Не активен'}</td>
								<td className={classes}>
									<Button
										variant='outlined'
										className='border-accent text-accent w-[165px]'
										onClick={handleClickDeactivate(item)}>
										{item.isActive ? 'Деактивировать' : 'Активировать'}
									</Button>
								</td>
								<td className={classes}>
									<IconButton
										className='bg-transparent border-r-1 shadow-none'
										onClick={handleClickDelete(item.id)}>
										<TrashIcon color='red' />
									</IconButton>
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
									onClick={handleChangePage(currentPage)}>
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

export default TableEmployees;
