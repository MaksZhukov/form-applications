'user client';

import { createApplication } from '@/app/api/applications';
import { updateApplication } from '@/app/api/applications/[id]';
import { ApiApplication } from '@/app/api/applications/types';
import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import BlankIcon from '@/icons/BlankIcon';
import { Button, Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { FC, FormEventHandler, useRef } from 'react';

interface Props {
	data?: ApiApplication | null;
	newApplicationId?: number;
	onCancel: () => void;
	onCreated?: () => void;
	onUpdated?: () => void;
}

const Application: FC<Props> = ({ data, newApplicationId, onCancel, onCreated, onUpdated }) => {
	const { data: userData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUser()
	});
	const client = useQueryClient();

	const isAdmin = userData?.data.data.role === 'admin';
	const ref = useRef<HTMLFormElement>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);

	const updateApplicationMutation = useMutation(updateApplication);
	const createApplicationMutation = useMutation(createApplication);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (ref.current) {
			if (isAdmin && data) {
				const formData = new FormData(ref.current);
				await updateApplicationMutation.mutateAsync({ id: data.id, data: formData });
				if (onUpdated) {
					onUpdated();
				}
			} else if (!data) {
				const formData = new FormData(ref.current);
				await createApplicationMutation.mutateAsync(formData);
				onCancel();
				if (onCreated) {
					onCreated();
				}
			}
			client.refetchQueries({ queryKey: ['application', getLoginTime(), 1] });
		}
	};
	const handleClickFile = () => {
		inputFileRef.current?.click();
	};

	return (
		<form ref={ref} onSubmit={handleSubmit}>
			<div className='flex mb-5'>
				<Typography className='mr-10'>№</Typography>{' '}
				<span className='border-b border-black'>
					AM-{(data?.id || newApplicationId || 0).toString().padStart(6, '0')}
				</span>
			</div>

			<div className='flex mb-5'>
				<Typography className='w-56'>Статус</Typography>{' '}
				{isAdmin ? (
					<select
						defaultValue={data?.status}
						name='status'
						className='flex-0.25 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
						<option value='В обработке' selected>
							В обработке
						</option>
						<option value='В работе'>В работе</option>
						<option value='Выполнена'>Выполнена</option>
					</select>
				) : (
					<Typography>{data?.status}</Typography>
				)}
			</div>

			<div className='flex mb-5'>
				<Typography className='w-56'>Наименование задачи*</Typography>{' '}
				<input
					type='text'
					disabled={!isAdmin && !!data}
					defaultValue={data?.title}
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='title'
					required
				/>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Описание задачи*</Typography>{' '}
				<textarea
					name='description'
					defaultValue={data?.description}
					required
					disabled={!isAdmin && !!data}
					rows={4}
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'></textarea>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Имя*</Typography>{' '}
				<input
					type='text'
					disabled={!isAdmin && !!data}
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='name'
					defaultValue={data?.name}
					required
				/>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Телефон*</Typography>{' '}
				<input
					type='text'
					disabled={!isAdmin && !!data}
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='phone'
					defaultValue={data?.phone}
					required
				/>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Email</Typography>{' '}
				<input
					type='text'
					disabled={!isAdmin && !!data}
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='email'
					defaultValue={data?.email}
				/>
			</div>

			<div className='flex mb-5'>
				<Typography className='w-56'>Дата создания заявки*</Typography>{' '}
				<input
					type='text'
					readOnly
					placeholder='11.11.2011'
					disabled={!isAdmin && !!data}
					className='flex-0.25 border-b border-black text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none'
					name='date'
					defaultValue={data?.date || new Date().toLocaleDateString()}
					required
				/>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Срок выполнения*</Typography>{' '}
				<input
					type='text'
					placeholder='11.11.2011'
					disabled={!isAdmin && !!data}
					className='flex-0.25 border-b border-black text-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none'
					name='deadline'
					defaultValue={data?.deadline}
					required
				/>
			</div>
			<div className='w-2/4'>
				<textarea
					name='comment'
					placeholder='Комментарий'
					defaultValue={data?.comment}
					disabled={!isAdmin && !!data}
					rows={4}
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'></textarea>
			</div>

			<div className='flex justify-end mt-4'>
				{data?.files ? (
					<div>
						<Typography>Прикрепленные файлы:</Typography>
						<div>
							{data.files.map((item, index) => (
								<Link
									className='font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3'
									key={item.id}
									href={`/api/uploads/${item.name}`}>
									Файл {index + 1}
								</Link>
							))}
						</div>
					</div>
				) : (
					<div className='flex items-center'>
						<Typography className='mr-4'>Прикрепить файл</Typography>{' '}
						<div onClick={handleClickFile} className='inline-block p-1 rounded-full border-gray-500 border'>
							<BlankIcon className='text-gray-500' fontSize={25}></BlankIcon>
							<input
								ref={inputFileRef}
								className='hidden'
								accept='.jpg, .png, .jpeg, .rar, .zip, .docx, .pdf'
								type='file'
								name='files'
								max={10}
								multiple></input>
						</div>
					</div>
				)}
				<div className='flex-1'></div>
				<Button variant='text' color='gray' className='mr-1' onClick={onCancel}>
					{data ? 'Вернуться' : 'Отмена'}
				</Button>
				{!data ? (
					<Button variant='outlined' className='border-accent text-accent' type='submit'>
						Отправить задачу
					</Button>
				) : isAdmin ? (
					<Button variant='outlined' className='border-accent text-accent' type='submit'>
						Обновить задачу
					</Button>
				) : null}
			</div>
		</form>
	);
};

export default Application;
