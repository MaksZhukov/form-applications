import { Typography } from '@material-tailwind/react';
import { FC, FormEventHandler } from 'react';
import { Organization, updateOrganization } from '@/app/api/organizations';
import Modal from '@/app/_components/common/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ResponsibleUserSelect from '@/app/_components/ResponsibleUserSelect';

interface Props {
	data: Organization;
	onUpdated: (data: Organization, formData: FormData) => void;
	onCancel: () => void;
}

const UpdateOrganization: FC<Props> = ({ onUpdated, onCancel, data }) => {
	const updateOrganizationMutation = useMutation({
		mutationFn: (params: { id: number; data: FormData }) => updateOrganization(params)
	});
	const client = useQueryClient();
	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		const formData = new FormData(e.target as HTMLFormElement);
		if (data) {
			e.preventDefault();

			updateOrganizationMutation.mutateAsync({ id: data.id, data: formData });
			client.invalidateQueries(['organizations']);
			alert('Организация изменена');
		}
		onUpdated(data, formData);
	};
	return (
		<Modal
			title='Изменение данных организации'
			onCancel={onCancel}
			onSubmit={handleSubmit}
			btnSubmitTitle='Изменить'>
			<div>
				<Typography>Название</Typography>
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
					name='phone'
					defaultValue={data.phone}
				/>
			</div>
			<div>
				<Typography>Email</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='email'
					defaultValue={data.email}
				/>
			</div>
			<div>
				<Typography>Ответственный за компанию</Typography>
				<ResponsibleUserSelect
					value={data.responsibleUserId?.toString()}
					className='w-full h-12 px-2'
					name='responsibleUserId'></ResponsibleUserSelect>
			</div>
			<div>
				<Typography>Адрес</Typography>
				<input
					type='text'
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					defaultValue={data.address}
					name='address'
				/>
			</div>
		</Modal>
	);
};

export default UpdateOrganization;
