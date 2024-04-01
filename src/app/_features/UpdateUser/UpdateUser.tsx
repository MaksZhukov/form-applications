import Modal from '@/app/_components/common/Modal';
import { ApiResponse } from '@/app/api/types';
import { UserAPI, updateUser } from '@/app/api/users';
import { getLoginTime } from '@/app/localStorage';
import { Typography } from '@material-tailwind/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC, FormEventHandler } from 'react';

interface Props {
	data: UserAPI;
	onCancel: () => void;
	onUpdated: () => void;
}

const UpdateUser: FC<Props> = ({ onUpdated, onCancel, data }) => {
	const updateUserMutation = useMutation({
		mutationFn: (params: { id: number; data: FormData }) => updateUser(params)
	});
	const client = useQueryClient();
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		if (data) {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			formData.append('organizationId', process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID);
			client.setQueryData<ApiResponse<UserAPI[]>>(['employees', getLoginTime()], (prev) =>
				prev
					? {
							...prev,
							data: prev.data.map((item) =>
								item.id === data.id
									? {
											...item,
											departmentName: formData.get('departmentName') as string,
											phone: formData.get('phone') as string,
											name: formData.get('name') as string
									  }
									: item
							)
					  }
					: undefined
			);
			await updateUserMutation.mutateAsync({ id: data.id, data: formData });
			client.invalidateQueries(['employees', getLoginTime(), 'isActive']);
			alert('Пользователь изменен');
			onUpdated();
		}
	};
	return (
		<Modal
			title='Изменение данных пользователя'
			onSubmit={handleSubmit}
			onCancel={onCancel}
			btnSubmitTitle='Изменить'>
			{' '}
			<div>
				<Typography>Наименование отдела</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='departmentName'
					defaultValue={data.departmentName}
					required
				/>
			</div>
			<div>
				<Typography>Имя</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='name'
					defaultValue={data.name}
					required
				/>
			</div>
			<div>
				<Typography>Телефон</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					defaultValue={data.phone}
					name='phone'
				/>
			</div>
		</Modal>
	);
};

export default UpdateUser;
