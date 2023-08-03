'user client';

import { createApplication } from '@/app/api/applications';
import { ApiApplication } from '@/app/api/applications/types';
import { Button, Input, Textarea, Typography } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { FC, FormEventHandler, useRef } from 'react';
interface Props {
	data?: ApiApplication | null;
	onClose: () => void;
	onCreated: () => void;
}

const Application: FC<Props> = ({ data, onClose, onCreated }) => {
	const ref = useRef<HTMLFormElement>(null);

	const { mutateAsync } = useMutation(createApplication);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (ref.current) {
			const formData = new FormData(ref.current);
			await mutateAsync(formData);
			onClose();
			onCreated();
		}
	};
	return (
		<form ref={ref} onSubmit={handleSubmit}>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Номер задачи</Typography> AM-0000001
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Наименование задачи</Typography>{' '}
				<Input required disabled={!!data} defaultValue={data?.title} name='title'></Input>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Описание задачи</Typography>{' '}
				<Input required disabled={!!data} defaultValue={data?.description} name='description'></Input>
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
					disabled={!!data}
					defaultValue={data?.date || new Date().toLocaleDateString()}
					name='date'
				></Input>
			</div>
			<div className='flex mb-5'>
				<Typography className='w-1/4'>Срок выполнения</Typography>{' '}
				<Input
					placeholder='11.11.2011'
					required
					disabled={!!data}
					defaultValue={data?.deadline}
					name='deadline'
				></Input>
			</div>
			<Textarea required disabled={!!data} placeholder='Комментарий' name='comment'></Textarea>
			{data?.files ? (
				<>Show files</>
			) : (
				<div>
					<Typography>Прикрепить файл</Typography> <Input required name='files' type='file'></Input>
				</div>
			)}
			<div className='flex justify-end mt-4'>
				<Button variant='text' color='gray' className='mr-1' onClick={onClose}>
					{data ? 'Вернуться' : 'Отмена'}
				</Button>
				{!data && (
					<Button variant='outlined' color='blue' type='submit'>
						Отправить задачу
					</Button>
				)}
			</div>
		</form>
	);
};

export default Application;
