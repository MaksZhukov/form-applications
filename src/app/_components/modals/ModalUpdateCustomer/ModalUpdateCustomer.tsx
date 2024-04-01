import { UserAPI } from '@/app/api/users';
import { Button, Typography } from '@material-tailwind/react';
import { FC, FormEventHandler } from 'react';
import ResponsibleUserSelect from '../../ResponsibleUserSelect';

interface Props {
	data: UserAPI;
	onSubmit: FormEventHandler<HTMLFormElement>;
	onCancel: () => void;
}

const ModalUpdateCustomer: FC<Props> = ({ onSubmit, onCancel, data }) => {
	return (
		<>
			<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
				<div className='relative w-auto my-6 mx-auto max-w-3xl'>
					{/*content*/}
					<form
						onSubmit={onSubmit}
						className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
						{/*header*/}
						<div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
							<h3 className='text-3xl font-semibold'>Изменение данных клиента</h3>
						</div>
						{/*body*/}
						<div className='relative p-6 flex-auto'>
							<div>
								<Typography>Название</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									name='name'
									defaultValue={data.organization?.name}
									required
								/>
							</div>
							<div>
								<Typography>Телефон</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									name='userPhone'
									defaultValue={data.phone}
								/>
							</div>
							<div>
								<Typography>Ответственный за компанию</Typography>
								<ResponsibleUserSelect
									value={data.organization.responsibleUserId?.toString()}
									className='w-full h-12 px-2'
									name='responsibleUserId'></ResponsibleUserSelect>
							</div>
							<div>
								<Typography>Адрес</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									defaultValue={data.organization.address}
									required
									name='address'
								/>
							</div>
						</div>
						{/*footer*/}
						<div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
							<Button
								onClick={onCancel}
								size='sm'
								className='ml-1 p-2 border-accent text-accent'
								variant='outlined'>
								Отмена
							</Button>
							<Button
								type='submit'
								size='sm'
								className='ml-1 p-2 border-accent text-accent'
								variant='outlined'>
								Изменить
							</Button>
						</div>
					</form>
				</div>
			</div>
			<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
		</>
	);
};

export default ModalUpdateCustomer;
