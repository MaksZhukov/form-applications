'user client';

import { createApplication } from '@/app/api/applications';
import { updateApplication } from '@/app/api/applications/[id]';
import { fetchFiles, uploadFiles } from '@/app/api/files';
import { fetchUser } from '@/app/api/user';
import { ApiResponse } from '@/app/api/types';
import { getLoginTime } from '@/app/localStorage';
import { FileAttributes } from '@/db/file/types';
import BlankIcon from '@/icons/BlankIcon';
import { Button, Typography } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Datepicker, { DateType, DateValueType } from 'react-tailwindcss-datepicker';
import { ChangeEventHandler, FC, FormEventHandler, useRef, useState } from 'react';
import { ApplicationInternalAttributes } from '@/db/applicationInternal/types';
import { fetchUsers } from '@/app/api/users';
import ResponsibleUserSelect from '../ResponsibleUserSelect';
import { UserAttributes } from '@/db/users/types';

interface Props {
	data?: ApplicationInternalAttributes | null;
	newApplicationId?: number;
	onCancel: () => void;
	onUpdated?: (data: ApplicationInternalAttributes) => void;
}

const ApplicationInternal: FC<Props> = ({ data, newApplicationId, onCancel, onUpdated }) => {
	const deadlineParts = data?.deadline ? data?.deadline.split('.') : null;
	const [deadline, setDeadline] = useState<null | DateType>(
		deadlineParts ? `${deadlineParts[1]}.${deadlineParts[0]}.${deadlineParts[2]}` : null
	);
	const [responsibleUser, setResponsibleUser] = useState<Pick<
		UserAttributes,
		'id' | 'name' | 'departmentName'
	> | null>(null);
	const { data: userData } = useQuery(['user', getLoginTime()], {
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const { data: usersData } = useQuery({
		queryKey: ['users', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUsers({ organizationId: +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID })
	});

	const isAdmin = userData?.data.role === 'admin';
	const isOwnerOrganizationWorker =
		userData?.data?.organization.id === +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID;

	const { data: files } = useQuery({
		queryKey: ['files', 'internal', data?.id],
		queryFn: () => fetchFiles(data?.id as number, 'internal'),
		staleTime: Infinity,
		retry: 0,
		enabled: !!data?.id
	});

	const client = useQueryClient();

	const ref = useRef<HTMLFormElement>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);

	const updateApplicationMutation = useMutation({
		mutationFn: (params: { id: number; data: FormData }) =>
			updateApplication<'internal'>({ ...params, applicationType: 'internal' })
	});
	const uploadFilesMutation = useMutation({
		mutationFn: (params: { applicationId: number; data: FormData }) =>
			uploadFiles<'internal'>({ ...params, applicationType: 'internal' })
	});
	const createApplicationMutation = useMutation({
		mutationFn: (params: FormData) => createApplication<'internal'>({ data: params, applicationType: 'internal' })
	});

	const disabledEdit = isAdmin ? false : !data ? false : data?.status !== 'в обработке';

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (ref.current) {
			const formData = new FormData(ref.current);
			let applicationId = data?.id;
			if (((isAdmin || isOwnerOrganizationWorker) && data) || data?.status === 'в обработке') {
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
						client.setQueryData<ApiResponse<FileAttributes[]>>(['files', 'internal', data?.id], (prev) =>
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
			client.refetchQueries({ queryKey: ['applications-internal', getLoginTime(), 1] });
		}
	};

	const handleClickFile = () => {
		inputFileRef.current?.click();
	};

	const handleChangeDeadline = (value: DateValueType) => {
		setDeadline(value ? value.startDate : null);
	};

	const handleChangeResponsibleUser: ChangeEventHandler<HTMLSelectElement> = (event) => {
		const responsibleUserObj = usersData?.data.data.find((item) => item.id === +event.target.value) || null;
		setResponsibleUser(responsibleUserObj);
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
		<form ref={ref} onSubmit={handleSubmit}>
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
						{isAdmin || isOwnerOrganizationWorker ? (
							<select
								defaultValue={data?.status || 'в обработке'}
								name='status'
								className='min-w-max h-8 flex-1 border border-gray-300 text-sm rounded-lg block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'>
								<option value='в обработке'>В обработке</option>
								<option value='в работе'>В работе</option>
								<option value='выполнено'>Выполнено</option>
							</select>
						) : (
							<input
								readOnly
								className='w-28'
								name='status'
								defaultValue={data?.status || 'в обработке'}></input>
						)}
					</div>
				</div>
				<div className='flex items-center'>
					<Typography className='w-36'>Ответственный</Typography>
					<ResponsibleUserSelect
						onChange={handleChangeResponsibleUser}
						value={data?.responsibleUserId}
						className='w-56 h-8'></ResponsibleUserSelect>
				</div>

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
				<Typography className='w-56'>Наименование отдела</Typography>{' '}
				<input
					type='text'
					key={responsibleUser?.id}
					readOnly
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='departmentName'
					defaultValue={responsibleUser?.departmentName || data?.departmentName}
				/>
			</div>

			<div className='flex mb-5'>
				<Typography className='w-56'>Сотрудник</Typography>
				<input
					type='text'
					readOnly
					className='flex-0.5 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					name='employee'
					defaultValue={data?.employee || userData?.data?.name}
				/>
			</div>

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
						`${cl} border-b border-black rounded-none focus:outline-none focus:shadow-none focus:transition-none text-black`
					}
					containerClassName={(cl) => `${cl} flex-0.25`}
				/>
			</div>

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
				) : isAdmin || isOwnerOrganizationWorker || data.status === 'в обработке' ? (
					<Button variant='outlined' className='border-accent text-accent' type='submit'>
						Обновить задачу
					</Button>
				) : null}
			</div>
		</form>
	);
};

export default ApplicationInternal;
