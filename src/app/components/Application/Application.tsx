'user client';

import { createApplication } from '@/app/api/applications';
import { updateApplication } from '@/app/api/applications/[id]';
import { fetchFiles, uploadFiles } from '@/app/api/files';
import { fetchUser } from '@/app/api/user';
import { fetchOrganizations } from '@/app/api/organizations';
import { ApiResponse } from '@/app/api/types';
import { getLoginTime } from '@/app/localStorage';
import { ApplicationAttributes } from '@/db/application/types';
import { FileAttributes } from '@/db/file/types';
import { OrganizationAttributes } from '@/db/organization/types';
import BlankIcon from '@/icons/BlankIcon';
import { Button, Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Datepicker, { DateType, DateValueType } from 'react-tailwindcss-datepicker';
import { FC, FormEventHandler, LegacyRef, useRef, useState } from 'react';
import MaskedInput from 'react-text-mask';

interface Props {
	data?: (ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'name'> }) | null;
	newApplicationId?: number;
	onCancel: () => void;
	onUpdated?: (data: ApplicationAttributes) => void;
}

const Application: FC<Props> = ({ data, newApplicationId, onCancel, onUpdated }) => {
	const [deadline, setDeadline] = useState<null | DateType>(data?.deadline || null);
	const { data: userData, isSuccess } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const isAdmin = userData?.data.role === 'admin';
	const { data: organizations } = useQuery({
		queryKey: ['organizations', getLoginTime()],
		staleTime: Infinity,
		enabled: isAdmin,
		retry: 0,
		queryFn: () => fetchOrganizations()
	});

	const { data: files } = useQuery({
		queryKey: ['files', data?.id],
		queryFn: () => fetchFiles(data?.id as number, 'common'),
		staleTime: Infinity,
		retry: 0,
		enabled: !!data?.id
	});

	const client = useQueryClient();

	const ref = useRef<HTMLFormElement>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const updateApplicationMutation = useMutation(updateApplication);
	const uploadFilesMutation = useMutation(uploadFiles);
	const createApplicationMutation = useMutation(createApplication);

	const disabledEdit = isAdmin ? false : !data ? false : data?.status !== 'в обработке';
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (ref.current) {
			const formData = new FormData(ref.current);
			let applicationId = data?.id;
			if ((isAdmin && data) || data?.status === 'в обработке') {
				const { data: updatedData } = await updateApplicationMutation.mutateAsync({
					id: data.id,
					data: formData
				});
				if (onUpdated) {
					onUpdated(updatedData);
				}
			} else if (!data) {
				const {
					data: { data: createApplication }
				} = await createApplicationMutation.mutateAsync(formData);
				applicationId = createApplication.id;
			}

			if (inputFileRef.current?.files?.length) {
				const formDataFiles = new FormData();
				for (let i = 0; i < inputFileRef.current.files.length; i++) {
					const file = inputFileRef.current.files[i];
					formDataFiles.append('files', file, file.name);
					const { data: uploadedFiles } = await uploadFilesMutation.mutateAsync({
						applicationId: applicationId as number,
						data: formDataFiles
					});

					if (files) {
						client.setQueryData<ApiResponse<FileAttributes[]>>(['files', data?.id], (prev) =>
							prev
								? {
										...prev,
										data: [...prev.data, ...uploadedFiles]
								  }
								: undefined
						);
					}
				}
				inputFileRef.current.value = '';
			}

			if (!data) {
				onCancel();
			}
			client.refetchQueries({ queryKey: ['application', getLoginTime(), 1] });
		}
	};

	const handleClickFile = () => {
		inputFileRef.current?.click();
	};

	const handleChangeDeadline = (value: DateValueType) => {
		setDeadline(value ? value.startDate : null);
	};

	const renderPinnedFiles = (
		<div>
			<Typography className='leading-3 mb-1'>Прикрепленные файлы:</Typography>
			<div>
				{files?.data.map((item, index) => (
					<Link
						className='font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3'
						key={item.id}
						href={`/api/files/${item.name}`}>
						Файл {index + 1}
					</Link>
				))}
			</div>
		</div>
	);

	return (
		<form className={data ? '2xl:w-[75%] xl:w-[70%] lg:w-[70%]' : ''} ref={ref} onSubmit={handleSubmit}>
			<div className='flex mb-5'>
				<div className='flex mr-20'>
					<Typography className='mr-10'>№</Typography>{' '}
					<span className='border-b border-black'>
						AM-{(data?.id || newApplicationId || 0).toString().padStart(6, '0')}
					</span>
				</div>
				<div className='flex'>
					<Typography className='mr-10'>Дата создания</Typography>{' '}
					<input
						readOnly
						defaultValue={
							data?.createdAt
								? new Date(data?.createdAt).toLocaleDateString()
								: new Date().toLocaleDateString()
						}></input>
				</div>
			</div>

			<div className='flex mb-5 2xl:justify-normal lg:justify-between lg:gap-1 2xl:gap-10'>
				<div className='flex justify-between'>
					<div className='flex items-center'>
						<Typography className='w-20'>Статус</Typography>{' '}
						{isAdmin ? (
							<select
								defaultValue={data?.status}
								name='status'
								className='min-w-max h-8 flex-1 border border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
								<option value='в обработке' selected>
									В обработке
								</option>
								<option value='в работе'>В работе</option>
								<option value='выполнено'>Выполнено</option>
							</select>
						) : (
							<input readOnly name='status' defaultValue={data?.status || 'в обработке'}></input>
						)}
					</div>
				</div>
				{isAdmin && organizations && (
					<div className='flex items-center'>
						<Typography className='w-32'>Организация</Typography>
						<select
							required
							defaultValue={
								organizations.data.data.find((item) => item.name === data?.organization.name)?.id
							}
							name='organizationId'
							className='mt-1 border w-44 h-8 border-gray-300 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
							{organizations.data.data.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
						</select>
					</div>
				)}
				<div className='flex items-center text-xs'>
					<Typography variant='small' className='mr-2'>
						Срочная задача
					</Typography>
					<input type='checkbox' name='isUrgent' defaultChecked={data?.isUrgent}></input>
				</div>
				{isAdmin && (
					<div className='flex items-center'>
						<Typography variant='small' className='mr-2'>
							Добавить в архив
						</Typography>
						<input type='checkbox' name='isArchived' defaultChecked={data?.isArchived}></input>
					</div>
				)}
			</div>

			<div className='flex mb-5'>
				<Typography className='w-56'>Наименование*</Typography>{' '}
				<input
					type='text'
					disabled={disabledEdit}
					defaultValue={data?.title}
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='title'
					required
				/>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Описание*</Typography>{' '}
				<textarea
					name='description'
					defaultValue={data?.description}
					required
					disabled={disabledEdit}
					rows={4}
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'></textarea>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Имя*</Typography>{' '}
				<input
					type='text'
					disabled={disabledEdit}
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='name'
					defaultValue={data?.name}
					required
				/>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Телефон*</Typography>{' '}
				<MaskedInput
					defaultValue={data?.phone}
					mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
					render={(ref, props) => (
						<input
							ref={ref as LegacyRef<HTMLInputElement>}
							type='text'
							disabled={disabledEdit}
							className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
							name='phone'
							placeholder='(29) 999-9999'
							required
							{...props}
						/>
					)}></MaskedInput>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-56'>Email</Typography>{' '}
				<input
					type='text'
					disabled={disabledEdit}
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='email'
					defaultValue={data?.email}
				/>
			</div>

			{isAdmin && (
				<div className='flex mb-5'>
					<Typography className='w-56'>Срок выполнения*</Typography>{' '}
					<Datepicker
						minDate={new Date()}
						value={{ startDate: deadline, endDate: deadline }}
						onChange={handleChangeDeadline}
						asSingle
						i18n='ru'
						displayFormat='DD.MM.YYYY'
						useRange={false}
						placeholder='24.12.2012'
						inputName='deadline'
						inputClassName={(cl) =>
							`${cl} border-b border-black rounded-none focus:outline-none focus:shadow-none focus:transition-none`
						}
						containerClassName={(cl) => `${cl} flex-0.25`}
					/>
				</div>
			)}
			<div className='w-3/4'>
				<textarea
					name='comment'
					placeholder='Комментарий'
					defaultValue={data?.comment}
					disabled={disabledEdit}
					rows={4}
					className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'></textarea>
			</div>

			<div className='flex justify-end items-center mt-4'>
				{files?.data.length && data?.status !== 'в обработке' ? (
					renderPinnedFiles
				) : (
					<>
						<div>
							<div className='flex items-center'>
								<Typography className='mr-3'>
									Прикрепить файлы(до {10 - (files?.data.length || 0)})
								</Typography>{' '}
								<div
									onClick={handleClickFile}
									className='inline-block cursor-pointer p-1 rounded-full border-gray-500 border'>
									<BlankIcon className='text-gray-500' fontSize={20}></BlankIcon>
									<input
										ref={inputFileRef}
										className='hidden'
										accept='.jpg, .png, .jpeg, .rar, .zip, .docx, .pdf'
										type='file'
										max={10 - (files?.data.length || 0)}
										multiple></input>
								</div>
							</div>
							{!!files?.data.length && renderPinnedFiles}
						</div>
					</>
				)}
				<div className='flex-1'></div>
				<Button variant='text' color='gray' className='mr-1' onClick={onCancel}>
					{data ? 'Вернуться' : 'Отмена'}
				</Button>
				{!data ? (
					<Button variant='outlined' className='border-accent text-accent' type='submit'>
						Отправить задачу
					</Button>
				) : isAdmin || data.status === 'в обработке' ? (
					<Button variant='outlined' className='border-accent text-accent' type='submit'>
						Обновить задачу
					</Button>
				) : null}
			</div>
		</form>
	);
};

export default Application;
