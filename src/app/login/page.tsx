'use client';

import { Button, Typography } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { login } from '../api/login';
import { saveLoginTime } from '../localStorage';

export default function Login() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const router = useRouter();
	const { mutateAsync } = useMutation<any, any, { email: string; password: string }>({
		mutationFn: (data) => login(data.email, data.password)
	});

	const handleSignIn = async () => {
		await mutateAsync({ email, password });
		saveLoginTime(new Date().getTime().toString());
		router.push('/');
	};
	const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	return (
		<main className='container mx-auto flex h-screen items-center'>
			<div className='text-center flex-1'>
				<Image className='m-auto' alt='Service Desk' src='/service-desk.jpg' width={500} height={500}></Image>
				<Typography variant='h2' className='text-gray-800'>
					Service Desk
				</Typography>
			</div>
			<div className='flex-1 flex flex-col'>
				<Image className='mx-auto mb-12' src={'/logo.png'} width={350} height={29} alt='Logo'></Image>
				<div className='w-96 mx-auto'>
					<div className='mb-4'>
						<label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Email
						</label>
						<input
							type='text'
							id='email'
							value={email}
							onChange={handleChangeEmail}
							className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-accent block w-full p-5 focus:outline-none'
							placeholder='John'
							required
						/>
					</div>
					<div className='mb-4'>
						<label
							htmlFor='password'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Пароль
						</label>
						<input
							value={password}
							onChange={handleChangePassword}
							type='password'
							id='password'
							className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-accent block w-full p-5 focus:outline-none'
							placeholder='John'
							required
						/>
					</div>
					<Button className='bg-accent p-5' onClick={handleSignIn} fullWidth>
						Войти
					</Button>
				</div>
			</div>
		</main>
	);
}
