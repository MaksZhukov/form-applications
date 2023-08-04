'user client';

import { createApplication } from '@/app/api/applications';
import { ApiApplication } from '@/app/api/applications/types';
import BlankIcon from '@/icons/BlankIcon';
import { Button, Input, Textarea, Typography } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { FC, FormEventHandler, useRef } from 'react';
interface Props {
	data?: ApiApplication | null;
	applicationNumber: number;
	onClose: () => void;
	onCreated: () => void;
}

const Application: FC<Props> = ({ data, onClose, onCreated, applicationNumber }) => {
	const ref = useRef<HTMLFormElement>(null);
	const inputFileRef = useRef<HTMLInputElement>(null);

	const { mutateAsync } = useMutation(createApplication);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (ref.current) {
			const formData = new FormData(ref.current);
			console.log(formData.get('files'));
			debugger;
			await mutateAsync(formData);
			onClose();
			onCreated();
		}
	};
	const handleClickFile = () => {
		console.log(inputFileRef);
		inputFileRef.current?.click();
	};
	return (
		<form ref={ref} onSubmit={handleSubmit}>
			<div className='flex mb-5'>
				<Typography className='mr-10'>№</Typography>{' '}
				<span className='border-b border-black'>
					AM-{(data?.id || applicationNumber).toString().padStart(6, '0')}
				</span>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Наименование задачи</Typography>{' '}
				<Input
					required
					className='focus:border-accent'
					disabled={!!data}
					defaultValue={data?.title}
					name='title'></Input>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Описание задачи</Typography>{' '}
				<textarea
					name='description'
					required
					rows={4}
					className='block p-2.5 w-full text-sm rounded-lg border focus:ring-blue-500 focus:border-accent focus:border-accent'></textarea>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Имя</Typography>{' '}
				<Input required disabled={!!data} defaultValue={data?.name} name='name'></Input>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Телефон</Typography>{' '}
				<Input required disabled={!!data} defaultValue={data?.phone} name='phone'></Input>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Email</Typography>{' '}
				<Input required disabled={!!data} defaultValue={data?.email} name='email'></Input>
			</div>

			<div className='flex mb-5'>
				<Typography className='w-1/4'>Дата задачи</Typography>{' '}
				<Input
					placeholder='11.11.2011'
					required
					className='pl-4'
					variant='standard'
					disabled={!!data}
					defaultValue={data?.date || new Date().toLocaleDateString()}
					name='date'></Input>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Срок выполнения</Typography>{' '}
				<Input
					variant='standard'
					placeholder='11.11.2011'
					className='pl-4'
					required
					disabled={!!data}
					defaultValue={data?.deadline}
					name='deadline'></Input>
			</div>
			<div className='w-2/4'>
				<Textarea required disabled={!!data} placeholder='Комментарий' name='comment'></Textarea>
			</div>

			<div className='flex justify-end mt-4'>
				{data?.files ? (
					<>Show files</>
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
				<Button variant='text' color='gray' className='mr-1' onClick={onClose}>
					{data ? 'Вернуться' : 'Отмена'}
				</Button>
				{!data && (
					<Button variant='outlined' className='border-accent text-accent' type='submit'>
						Отправить задачу
					</Button>
				)}
			</div>
		</form>
	);
};

export default Application;
