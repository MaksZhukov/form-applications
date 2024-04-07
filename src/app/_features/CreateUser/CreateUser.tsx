import Modal from '@/app/_components/common/Modal';
import { fetchOrganizations } from '@/app/api/organizations';
import { fetchUser } from '@/app/api/user';
import { createUser } from '@/app/api/users';
import { getLoginTime } from '@/app/localStorage';
import { Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, FormEventHandler } from 'react';

interface Props {
	title?: string;
	withOrganization?: boolean;
	defaultOrganization?: string;
	onCreated: () => void;
	onCancel: () => void;
}

const CreateUser: FC<Props> = ({
	onCreated,
	onCancel,
	title = 'Добавление пользователя',
	defaultOrganization,
	withOrganization = true
}) => {
	const { data: userData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});
	const createUserMutation = useMutation(createUser);
	const isAdmin = userData?.data.role === 'admin';

	const { data: organizations } = useQuery({
		queryKey: ['organizations', getLoginTime()],
		staleTime: Infinity,
		enabled: isAdmin,
		retry: 0,
		queryFn: () => fetchOrganizations()
	});

	const handleSubmitCreateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		if (defaultOrganization) {
			formData.append('organizationId', defaultOrganization);
		}
		await createUserMutation.mutateAsync(formData);
		alert('Пользователь добавлен');
		onCreated();
	};

	return (
		<Modal onSubmit={handleSubmitCreateUser} onCancel={onCancel} title={title}>
			{withOrganization && (
				<div>
					<Typography>Организация</Typography>
					<select
						required
						defaultValue={
							organizations?.data.find((item) => item.name === userData?.data?.organization.name)?.id
						}
						name='organizationId'
						className='h-11 mt-1 border border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
						{organizations?.data.map((item) => (
							<option key={item.id} value={item.id}>
								{item.name}
							</option>
						))}
					</select>
				</div>
			)}
			<div>
				<Typography>Наименование отдела</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='departmentName'
					required
				/>
			</div>
			<div>
				<Typography>Имя</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='name'
					required
				/>
			</div>
			<div>
				<Typography>Телефон</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='phone'
				/>
			</div>
			<div>
				<Typography>Email</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='email'
					required
				/>
			</div>
			<div>
				<Typography>Пароль</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='password'
					required
				/>
			</div>
		</Modal>
	);
};

export default CreateUser;
