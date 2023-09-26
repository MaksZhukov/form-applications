'use client';

import { logout } from '@/app/api/logout';
import { fetchUser } from '@/app/api/user';
import { createOrganization } from '@/app/api/organizations';
import { getLoginTime, saveSelectedOrganizationId } from '@/app/localStorage';
import { Button, Menu, MenuHandler, MenuItem, MenuList, Spinner, Typography } from '@material-tailwind/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, FormEventHandler, ReactNode, useEffect, useState } from 'react';
import ModalCreateOrganization from '../modals/ModalCreateOrganization';
import { createUser } from '@/app/api/users';
import ModalCreateUser from '../modals/ModalCreateUser';

interface Props {
	children: ReactNode;
	onClickLogo?: () => void;
}

const Layout: FC<Props> = ({ children, onClickLogo = () => {} }) => {
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
		router.push('/');
		saveSelectedOrganizationId('none');
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
						Добро пожаловать {data?.data.role === 'admin' && 'админ'}
						<span className='text-accent font-bold pl-2'>{data?.data.email}</span>
						<Menu placement='bottom-end'>
							<MenuHandler>
								<Button size='sm' className='ml-1 p-2 border-accent text-accent' variant='outlined'>
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
				</div>
			</header>
			<div className='container min-h-[calc(100vh-81px)] mx-auto pt-20 pb-10'>{children}</div>
			<footer className='p-10 border-t-accent border-t'></footer>
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

export default Layout;
