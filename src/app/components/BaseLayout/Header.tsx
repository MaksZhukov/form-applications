'use client';

import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import Image from 'next/image';
import { FC, FormEventHandler, useEffect, useState } from 'react';
import ModalCreateOrganization from '../modals/ModalCreateOrganization';
import ModalCreateUser from '../modals/ModalCreateUser';
import { getLoginTime, saveSelectedOrganizationId } from '@/app/localStorage';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/api/user';
import { createOrganization } from '@/app/api/organizations';
import { createUser, fetchUsers } from '@/app/api/users';
import { useRouter } from 'next/navigation';

interface Props {
	onClickLogo: () => void;
	onLogout: () => void;
}

export const Header: FC<Props> = ({ onClickLogo, onLogout }) => {
	const router = useRouter();
	const [showModal, setShowModal] = useState<'createOrganization' | 'createUser' | null>(null);
	const { data } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const { refetch } = useQuery({
		queryKey: ['users', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUsers({ organizationId: +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID })
	});

	const createOrganizationMutation = useMutation(createOrganization);
	const createUserMutation = useMutation(createUser);
	const handleClickAddOrganization = () => {
		setShowModal('createOrganization');
	};

	const handleClickAddUser = () => {
		setShowModal('createUser');
	};

	const handleCancel = async () => {
		await refetch();
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
		await refetch();
		alert('Пользователь добавлен');
		setShowModal(null);
	};

	return (
		<>
			<header className='px-4 flex fixed justify-between w-full border-b border-gray-300 bg-white py-4 z-10'>
				<Image
					onClick={onClickLogo}
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
							{data?.data.role === 'admin' && (
								<MenuItem onClick={handleClickAddOrganization}>Добавить организацию</MenuItem>
							)}
							{data?.data.role === 'admin' && (
								<MenuItem onClick={handleClickAddUser}>Добавить пользователя</MenuItem>
							)}
							<MenuItem onClick={onLogout}>Выход</MenuItem>
						</MenuList>
					</Menu>{' '}
				</span>
			</header>
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
