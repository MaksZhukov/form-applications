'use client';

import { logout } from '@/app/api/logout';
import { fetchUser } from '@/app/api/user';
import { getLoginTime, saveSelectedOrganizationId } from '@/app/localStorage';
import { Spinner } from '@material-tailwind/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { FC, ReactNode, useEffect } from 'react';

import Link from 'next/link';
import { SideBar } from './SideBar';
import { Header } from './Header';
import { socketService } from '@/app/socket';

interface Props {
	children: ReactNode;
	onClickLogo: () => void;
}

const BaseLayout: FC<Props> = ({ children, onClickLogo }) => {
	const router = useRouter();
	const { isLoading, isError, error } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const { mutateAsync } = useMutation({ mutationFn: () => logout() });

	useEffect(() => {
		//@ts-expect-error error
		if (error?.response.status === 401 || error?.response.status === 400) {
			handleLogout();
		} else {
			if (!socketService.loading && !socketService.socket) {
				socketService.init();
			}
		}
	}, [error]);

	const handleLogout = async () => {
		try {
			await mutateAsync();
		} catch (err) {}
		saveSelectedOrganizationId('none');
		router.push('/login');
	};

	const handleClickLogo = () => {
		onClickLogo();
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
			<Header onClickLogo={handleClickLogo} onLogout={handleLogout}></Header>
			<div className='min-h-[calc(100vh-81px)] pt-16 flex'>
				<SideBar></SideBar>
				<div className='ml-20 px-4 py-6 flex-1'>{children}</div>
			</div>
			<footer className='p-10 relative bg-white z-1 border-t-accent border-t'></footer>
		</>
	);
};

export default BaseLayout;
