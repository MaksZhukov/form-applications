import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import { Button, Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, ChangeEventHandler, FC, FormEventHandler, useState } from 'react';

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
	'8 часов'
];

const KIND_OF_WORK = ['Разработка'];

const ModalAddLaborCosts: FC<Props> = ({ onSubmit, onCancel }) => {
	const [isAddingKindOfWork, setIsAddingKindOfWork] = useState<boolean>(false);
	const [kindOfWork, setKindOfWork] = useState<string>('');
	const { data: userData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const handleClickAddKindOfWork = () => {
		setIsAddingKindOfWork(!isAddingKindOfWork);
	};

	const handleChangeInputKindOfWork: ChangeEventHandler<HTMLInputElement> = (event) => {
		setKindOfWork(event.target.value);
	};

	const handleClickSaveKindOfWork = () => {
		if (kindOfWork.length > 0) {
			setKindOfWork('');
			setIsAddingKindOfWork(false);
		}
	};

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
							<h3 className='text-3xl font-semibold'>Добавление Трудозатрат</h3>
						</div>
						{/*body*/}
						<div className='relative p-6 flex-auto'>
							<div className='mb-2'>
								<Typography>Дата</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									name='date'
									required
									defaultValue={new Date().toLocaleDateString()}
								/>
							</div>
							<div className='mb-2'>
								<Typography>Сотрудник</Typography>
								<input
									type='text'
									className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
									name='employee'
									readOnly
									required
									defaultValue={userData?.data?.name || ''}
								/>
							</div>
							<div className='mb-2'>
								<div className='flex justify-between mb-1'>
									<Typography>Вид работы</Typography>
									<Button
										size='sm'
										onClick={handleClickAddKindOfWork}
										className='px-2 py-1 border-accent text-accent'
										variant='outlined'>
										{isAddingKindOfWork ? 'Скрыть' : 'Добавить'}
									</Button>
								</div>
								{isAddingKindOfWork && (
									<div className='flex gap-5 mb-2'>
										<input
											value={kindOfWork}
											onChange={handleChangeInputKindOfWork}
											type='text'
											className='flex-1 border border-gray-300 text-sm rounded-lg block w-full px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
										/>
										<Button
											size='sm'
											onClick={handleClickSaveKindOfWork}
											className='px-2 py-1 border-accent text-accent'
											variant='outlined'>
											Сохранить
										</Button>
									</div>
								)}
								<select
									className={`font-normal w-full h-8 border border-gray-300 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none`}>
									{KIND_OF_WORK.map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>
							<div className='mb-2'>
								<Typography>Количество затраченого времени</Typography>
								<select
									className={`font-normal w-full h-8 border border-gray-300 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none`}>
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
