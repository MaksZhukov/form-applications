import { Button, Spinner, Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '../localStorage';
import { UserAPI, updateUser } from '../api/users';
import { FormEventHandler, useState } from 'react';
import { API_LIMIT_ITEMS } from '@/constants';
import Pagination from '../_components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import ModalUpdateCustomer from '../_components/modals/ModalUpdateCustomer';
import { ApiResponse } from '../api/types';
import { Organization, fetchOrganizations, updateOrganization } from '../api/organizations';

const TABLE_HEAD = [
	{ name: 'УНП' },
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
	const [updateCustomerModalData, setUpdateCustomerModalData] = useState<Organization | null>(null);
	const search = searchParams.get('search') || '';
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const client = useQueryClient();
	const router = useRouter();

	const updateOrganizationMutation = useMutation({
		mutationFn: (params: { id: number; data: FormData }) => updateOrganization(params)
	});

	const { data, isLoading } = useQuery({
		queryKey: ['customers', page, search, getLoginTime()],
		retry: 0,
		keepPreviousData: true,
		staleTime: Infinity,
		queryFn: () =>
			fetchOrganizations({
				offset: (page - 1) * API_LIMIT_ITEMS,
				search,
				limit: API_LIMIT_ITEMS
			})
	});

	const handleChangePage = (newPage: number) => () => {
		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('page', `${newPage}`);
		router.push('/customers?' + params.toString());
		window.scroll(0, 0);
	};

	const handleOpenChangeModal = (data: Organization) => () => {
		setUpdateCustomerModalData(data);
	};

	const handleCancel = () => {
		setUpdateCustomerModalData(null);
	};

	const handleSubmitUpdateCustomer: FormEventHandler<HTMLFormElement> = async (e) => {
		if (updateCustomerModalData) {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			const employees = client.getQueryData<ApiResponse<UserAPI[]>>(['employees', getLoginTime(), 'isActive']);
			const newResponsibleUserId = formData.get('responsibleUserId') as string;
			client.setQueryData<ApiResponse<Organization[]>>(['customers', page, search, getLoginTime()], (prev) =>
				prev
					? {
							...prev,
							data: prev.data.map((item) => {
								let newItem = item;
								if (item.id === updateCustomerModalData.id) {
									newItem.name = formData.get('name') as string;
									newItem.address = formData.get('address') as string;
									newItem.email = formData.get('email') as string;
									newItem.phone = formData.get('phone') as string;
									newItem.responsibleUser =
										newResponsibleUserId !== 'none'
											? (employees?.data.find(
													(item) => item.id === +newResponsibleUserId
											  ) as UserAPI)
											: undefined;
									newItem.responsibleUserId =
										newResponsibleUserId !== 'none' ? +newResponsibleUserId : undefined;
								}
								return newItem;
							})
					  }
					: undefined
			);
			updateOrganizationMutation.mutateAsync({ id: updateCustomerModalData.id, data: formData });
			client.invalidateQueries(['organizations']);
			alert('Клиент изменен');
			setUpdateCustomerModalData(null);
		}
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
								<td className={classes}>{item.uid}</td>
								<td className={classes}>{item.name}</td>
								<td className={classes}>{item.phone}</td>
								<td className={classes}>{item.email}</td>
								<td className={classes}>{item.responsibleUser?.name}</td>
								<td className={classes}>{new Date(item.createdAt).toLocaleDateString()}</td>
								<td className={classes}>{item.address}</td>
								<td className={classes}>
									<Button
										variant='outlined'
										className='border-accent text-accent w-[165px]'
										onClick={handleOpenChangeModal(item)}>
										Изменить
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Pagination page={page} countPages={countPages} onChangePage={handleChangePage} />
			{updateCustomerModalData && (
				<ModalUpdateCustomer
					data={updateCustomerModalData}
					onSubmit={handleSubmitUpdateCustomer}
					onCancel={handleCancel}
				/>
			)}
		</>
	);
};

export default TableCustomers;
