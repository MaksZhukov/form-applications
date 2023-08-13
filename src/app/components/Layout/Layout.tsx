'use client';

import { logout } from '@/app/api/logout';
import { fetchOrganization } from '@/app/api/organization';
import { createOrganization } from '@/app/api/organizations';
import { getLoginTime } from '@/app/localStorage';
import { Button, Menu, MenuHandler, MenuItem, MenuList, Spinner, Typography } from '@material-tailwind/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, FormEventHandler, ReactNode, useEffect, useState } from 'react';

interface Props {
	children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
	const router = useRouter();
	const [showModal, setShowModal] = useState<boolean>(false);
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchOrganization
	});
	const { mutateAsync } = useMutation({ mutationFn: () => logout() });
	const createOrganizationMutation = useMutation(createOrganization);

	useEffect(() => {
		//@ts-expect-error error
		if (error?.response.status === 401) {
			handleLogout();
		}
	}, [error]);

	const handleClickLogo = () => {
		router.push('/');
	};

	const handleLogout = async () => {
		try {
			await mutateAsync();
		} catch (err) {}
		router.push('/login');
	};

	const handleClickAdd = () => {
		setShowModal(true);
	};

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await createOrganizationMutation.mutateAsync(formData);
		alert('Организация добавлена');
		setShowModal(false);
	};

	if (isLoading || isError) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}

	return (
		<>
			<header className='fixed w-full bg-white py-4 z-10'>
				<div className='container flex justify-between mx-auto'>
					<Image
						onClick={handleClickLogo}
						className='cursor-pointer'
						src={'/logo.png'}
						width={300}
						height={29}
						alt='Logo'></Image>
					<span className='flex items-center'>
						Добро пожаловать
						<span className='text-accent font-bold pl-2'>{data?.data.email}</span>
						<Menu placement='bottom-end'>
							<MenuHandler>
								<Button size='sm' className='ml-1 p-2 border-accent text-accent' variant='outlined'>
									меню
								</Button>
							</MenuHandler>
							<MenuList>
								{data.data.role === 'admin' && (
									<MenuItem onClick={handleClickAdd}>Добавить организацию</MenuItem>
								)}
								<MenuItem onClick={handleLogout}>Выход</MenuItem>
							</MenuList>
						</Menu>{' '}
					</span>
				</div>
			</header>
			<div className='container mx-auto pt-20 pb-10'>{children}</div>
			<footer className='p-10 border-t-accent border-t'></footer>
			{showModal && (
				<>
					<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
						<div className='relative w-auto my-6 mx-auto max-w-3xl'>
							{/*content*/}
							<form
								onSubmit={handleSubmit}
								className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
								{/*header*/}
								<div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
									<h3 className='text-3xl font-semibold'>Добавление организации</h3>
								</div>
								{/*body*/}
								<div className='relative p-6 flex-auto'>
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
										<Typography>Пароль</Typography>
										<input
											type='text'
											className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
											name='password'
											required
										/>
									</div>
									<div>
										<Typography>Название организации</Typography>
										<input
											type='text'
											className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
											name='name'
											required
										/>
									</div>
									<div>
										<Typography>УНП</Typography>
										<input
											type='text'
											className='flex-1 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
											name='uid'
											required
										/>
									</div>
								</div>
								{/*footer*/}
								<div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
									<Button
										onClick={handleCancel}
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
			)}
		</>
	);
};

export default Layout;
