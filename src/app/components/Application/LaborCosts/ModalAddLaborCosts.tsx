import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import { Button, Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { FC, FormEventHandler } from 'react';

interface Props {
	onSubmit: FormEventHandler<HTMLFormElement>;
	onCancel: () => void;
}

const HOURS_OF_WORK = [
	'15 минут',
	'30 минут',
	'45 минут',
	'1 час',
	'2 часа',
	'3 часа',
	'4 часа',
	'5 часов',
	'6 часов',
	'7 часов',
	'8 часов',
];

const ModalAddLaborCosts: FC<Props> = ({ onSubmit, onCancel }) => {
	const { data: userData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser,
	});
	return (
		<>
			<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
				<div className='relative w-auto my-6 mx-auto max-w-3xl'>
					{/*content*/}
					<form
						onSubmit={onSubmit}
						className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'
					>
						{/*header*/}
						<div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
							<h3 className='text-3xl font-semibold'>Добавление Трудозатрат</h3>
						</div>
						{/*body*/}
						<div className='relative p-6 flex-auto'>
							<div>
								<Typography>Дата</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									name='date'
									required
									defaultValue={new Date().toLocaleDateString()}
								/>
							</div>
							<div>
								<Typography>Сотрудник</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									name='employee'
									required
									defaultChecked={userData?.data?.name || ''}
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
								<Typography>Количество часов</Typography>
								<select
									className={`font-normal border border-gray-300 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none`}
								>
									{HOURS_OF_WORK.map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>
						</div>
						{/*footer*/}
						<div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
							<Button onClick={onCancel} size='sm' className='ml-1 p-2 border-accent text-accent' variant='outlined'>
								Отмена
							</Button>
							<Button type='submit' size='sm' className='ml-1 p-2 border-accent text-accent' variant='outlined'>
								Добавить
							</Button>
						</div>
					</form>
				</div>
			</div>
			<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
		</>
	);
};

export default ModalAddLaborCosts;
