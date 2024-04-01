import { UserAPI } from '@/app/api/users';
import { Button, Typography } from '@material-tailwind/react';
import { FC, FormEventHandler, ReactNode } from 'react';

interface Props {
	title: string;
	children: ReactNode;
	btnSubmitTitle?: string;
	onSubmit: FormEventHandler<HTMLFormElement>;
	onCancel: () => void;
}

const Modal: FC<Props> = ({ onSubmit, onCancel, title, children, btnSubmitTitle = 'Добавить' }) => {
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
							<h3 className='text-3xl font-semibold'>{title}</h3>
						</div>
						{/*body*/}
						<div className='relative p-6 flex-auto'>{children}</div>
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
								{btnSubmitTitle}
							</Button>
						</div>
					</form>
				</div>
			</div>
			<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
		</>
	);
};

export default Modal;
