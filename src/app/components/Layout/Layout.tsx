'use client';

import { logout } from '@/app/api/logout';
import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import { Button, Spinner } from '@material-tailwind/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, ReactNode, useEffect } from 'react';

interface Props {
	children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
	const router = useRouter();
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		queryFn: () => fetchUser()
	});
	const { mutateAsync } = useMutation({ mutationFn: () => logout() });

	useEffect(() => {
		//@ts-expect-error error
		if (error?.response.status === 401) {
			router.replace('/login');
		}
	}, [error, router]);

	const handleClickLogo = () => {
		router.push('/');
	};

	const handleLogout = async () => {
		await mutateAsync();
		router.push('/login');
	};

	if (isLoading || isError) {
		return (
			<div className='container flex items-center h-screen mx-auto py-4'>
				<Spinner className='h-12 w-12 mx-auto'></Spinner>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-4'>
			<header className='flex justify-between mb-10'>
				<Image
					onClick={handleClickLogo}
					className='cursor-pointer'
					src={'/logo.png'}
					width={300}
					height={29}
					alt='Logo'></Image>
				<span className='flex items-center'>
					Добро пожаловать
					<span className='text-accent font-bold pl-2'>{data?.data.data.email}</span>
					<Button
						size='sm'
						className='ml-1 p-2 border-accent text-accent'
						variant='outlined'
						onClick={handleLogout}>
						Выход
					</Button>
				</span>
			</header>
			{children}
		</div>
	);
};

export default Layout;
