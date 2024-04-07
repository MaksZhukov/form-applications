'use client';

import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { getLoginTime } from '@/app/localStorage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUser } from '@/app/api/user';
import CreateUser from '@/app/_features/CreateUser';
import CreateOrganization from '@/app/_features/CreateOrganization';

interface Props {
	onClickLogo: () => void;
	onLogout: () => void;
}

export const Header: FC<Props> = ({ onClickLogo, onLogout }) => {
	const [showModal, setShowModal] = useState<'createOrganization' | 'createUser' | null>(null);
	const { data } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const client = useQueryClient();
	const handleClickAddOrganization = () => {
		setShowModal('createOrganization');
	};

	const handleClickAddUser = () => {
		setShowModal('createUser');
	};

	const handleCancel = async () => {
		setShowModal(null);
	};

	const handleCreateOrganization = () => {
		client.invalidateQueries(['organizations']);
		client.invalidateQueries(['customers']);
		setShowModal(null);
	};

	const handleCreateUser = () => {
		client.invalidateQueries(['employees']);
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
				<CreateOrganization onCancel={handleCancel} onCreated={handleCreateOrganization}></CreateOrganization>
			)}
			{showModal === 'createUser' && (
				<CreateUser onCancel={handleCancel} onCreated={handleCreateUser}></CreateUser>
			)}
		</>
	);
};
