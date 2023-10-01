'use client';

import { logout } from '@/app/api/logout';
import { fetchUser } from '@/app/api/user';
import { createOrganization } from '@/app/api/organizations';
import { getLoginTime, saveSelectedOrganizationId } from '@/app/localStorage';
import { Button, Menu, MenuHandler, MenuItem, MenuList, Spinner, Typography } from '@material-tailwind/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FC, FormEventHandler, ReactNode, useEffect, useState } from 'react';
import ModalCreateOrganization from '../modals/ModalCreateOrganization';
import { createUser } from '@/app/api/users';
import ModalCreateUser from '../modals/ModalCreateUser';
import TaskIcon from '@/icons/TaskIcon';
import Link from 'next/link';

interface Props {
	children: ReactNode;
	onClickLogo: () => void;
}

const BaseLayout: FC<Props> = ({ children, onClickLogo }) => {
	const router = useRouter();
	const [showModal, setShowModal] = useState<'createOrganization' | 'createUser' | null>(null);
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});
	const { mutateAsync } = useMutation({ mutationFn: () => logout() });
	const createOrganizationMutation = useMutation(createOrganization);
	const createUserMutation = useMutation(createUser);

	useEffect(() => {
		//@ts-expect-error error
		if (error?.response.status === 401) {
			handleLogout();
		}
	}, [error]);

	const handleClickLogo = () => {
		onClickLogo();
	};

	const handleLogout = async () => {
		try {
			await mutateAsync();
		} catch (err) {}
		saveSelectedOrganizationId('none');
		router.push('/login');
	};

	const handleClickAddOrganization = () => {
		setShowModal('createOrganization');
	};

	const handleClickAddUser = () => {
		setShowModal('createUser');
	};

	const handleCancel = () => {
		setShowModal(null);
	};

	const handleSubmitCreateOrganization: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await createOrganizationMutation.mutateAsync(formData);
		alert('Организация добавлена');
		setShowModal(null);
	};

	const handleSubmitCreateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await createUserMutation.mutateAsync(formData);
		alert('Пользователь добавлен');
		setShowModal(null);
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
			<header className='px-4 flex fixed justify-between w-full border-b border-gray-300 bg-white py-4 z-10'>
				<Image
					onClick={handleClickLogo}
					className='cursor-pointer'
					src={'/logo.png'}
					priority
					width={250}
					height={24.5}
					alt='Logo'></Image>
				<span className='flex items-center'>
					Добро пожаловать
					<span className='text-accent font-bold pl-2'>{data?.data.email}</span>
					{data?.data.role === 'admin' && '(админ)'}
					<Menu placement='bottom-end'>
						<MenuHandler>
							<Button size='sm' className='ml-3 p-2 border-accent text-accent' variant='outlined'>
								меню
							</Button>
						</MenuHandler>
						<MenuList>
							{data.data.role === 'admin' && (
								<MenuItem onClick={handleClickAddOrganization}>Добавить организацию</MenuItem>
							)}
							{data.data.role === 'admin' && (
								<MenuItem onClick={handleClickAddUser}>Добавить пользователя</MenuItem>
							)}
							<MenuItem onClick={handleLogout}>Выход</MenuItem>
						</MenuList>
					</Menu>{' '}
				</span>
			</header>
			<div className='min-h-[calc(100vh-81px)] pt-16 flex'>
				<div className='fixed h-full w-20 px-2 py-5 border-r border-gray-300 flex flex-col'>
					<Link href={'/applications'}>
						<Button
							size='sm'
							className='p-1 flex flex-col justify-center items-center border-accent text-accent'
							variant='outlined'>
							<TaskIcon fontSize={30}></TaskIcon>задачи
						</Button>
					</Link>
				</div>
				<div className='ml-20 px-4 py-6 flex-1'>{children}</div>
			</div>
			<footer className='p-10 relative bg-white z-1 border-t-accent border-t'></footer>
			{showModal === 'createOrganization' && (
				<ModalCreateOrganization
					onCancel={handleCancel}
					onSubmit={handleSubmitCreateOrganization}></ModalCreateOrganization>
			)}
			{showModal === 'createUser' && (
				<ModalCreateUser onCancel={handleCancel} onSubmit={handleSubmitCreateUser}></ModalCreateUser>
			)}
		</>
	);
};

export default BaseLayout;
