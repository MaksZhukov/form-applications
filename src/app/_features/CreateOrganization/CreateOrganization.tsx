import { Typography } from '@material-tailwind/react';
import { FC, FormEventHandler } from 'react';
import Modal from '@/app/_components/common/Modal';
import { createOrganization } from '@/app/api/organizations';
import { getLoginTime } from '@/app/localStorage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ResponsibleUserSelect from '@/app/_components/ResponsibleUserSelect';

interface Props {
	onCreated: () => void;
	onCancel: () => void;
}

const CreateOrganization: FC<Props> = ({ onCreated, onCancel }) => {
	const createOrganizationMutation = useMutation(createOrganization);
	const client = useQueryClient();

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await createOrganizationMutation.mutateAsync(formData);
		client.refetchQueries({ queryKey: ['organizations', getLoginTime()] });
		alert('Организация добавлена');
		onCreated();
	};
	return (
		<Modal title='Добавление организации' onCancel={onCancel} onSubmit={handleSubmit}>
			<div>
				<Typography>Название организации</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='name'
					required
				/>
			</div>
			<div>
				<Typography>УНП</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='uid'
					required
				/>
			</div>
			<div>
				<Typography>Адрес</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='address'
					required
				/>
			</div>
			<div>
				<Typography>Почта</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='email'
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
				<Typography>Ответственный</Typography>
				<ResponsibleUserSelect className='w-full h-12 px-2' name='responsibleUserId'></ResponsibleUserSelect>
			</div>
		</Modal>
	);
};

export default CreateOrganization;
