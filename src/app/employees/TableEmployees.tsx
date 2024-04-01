import { Button, IconButton, Spinner, Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '../localStorage';
import { UserAPI, deleteUser, fetchUsers, updateUser } from '../api/users';
import { useState } from 'react';
import { API_LIMIT_ITEMS } from '@/constants';
import { ApiResponse } from '../api/types';
import TrashIcon from '@/icons/trash.svg';
import Pagination from '../_components/Pagination';
import UpdateUser from '../_features/UpdateUser';

const nameByRole = {
	admin: 'админ',
	regular: 'обычный'
};

const TABLE_HEAD = [
	{ name: 'Имя' },
	{ name: 'email' },
	{ name: 'Роль' },
	{ name: 'Телефон' },
	{ name: 'Отдел' },
	{ name: 'Статус', width: 120 },
	{ name: '', width: 120 },
	{ name: '', width: 170 },
	{ name: '', width: 50 }
];

const TableEmployees = () => {
	const [updateUserModalData, setUpdateUserModalData] = useState<UserAPI | null>(null);
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

	const handleClickDeactivate = (item: UserAPI) => async () => {
		const formData = new FormData();
		formData.append('isActive', `${!item.isActive}`);
		client.setQueryData<ApiResponse<UserAPI[]>>(['employees', getLoginTime()], (prev) =>
			prev
				? {
						...prev,
						data: prev.data.map((el) => (el.id === item.id ? { ...el, isActive: !item.isActive } : el))
				  }
				: undefined
		);
		await updateUserMutation.mutateAsync({ id: item.id, data: formData });
		client.invalidateQueries(['employees', getLoginTime(), 'isActive']);
	};

	const handleClickDelete = (id: number) => async () => {
		if (window.confirm('Вы уверены?')) {
			client.setQueryData<ApiResponse<UserAPI[]>>(['employees', getLoginTime()], (prev) =>
				prev
					? {
							...prev,
							data: prev.data.filter((item) => item.id !== id)
					  }
					: undefined
			);
			await deleteUserMutation.mutateAsync(id);
			client.invalidateQueries(['employees', getLoginTime(), 'isActive']);
		}
	};

	const handleClickEdit = (item: UserAPI) => () => {
		setUpdateUserModalData(item);
	};

	const handleCancelUpdateUser = () => {
		setUpdateUserModalData(null);
	};
	const handleUpdatedUser = () => {
		setUpdateUserModalData(null);
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
								<td className={classes}>{item.phone}</td>
								<td className={classes}>{item.departmentName}</td>
								<td className={classes}>{item.isActive ? 'Активен' : 'Не активен'}</td>
								<td className={classes}>
									<Button
										variant='outlined'
										className='border-accent text-accent w-[165px]'
										onClick={handleClickEdit(item)}>
										Изменить
									</Button>
								</td>
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
			<Pagination countPages={countPages} onChangePage={handleChangePage} page={page} />
			{updateUserModalData && (
				<UpdateUser
					onUpdated={handleUpdatedUser}
					onCancel={handleCancelUpdateUser}
					data={updateUserModalData}></UpdateUser>
			)}
		</>
	);
};

export default TableEmployees;
