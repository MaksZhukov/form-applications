import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './query';
import { saveSelectedOrganizationId } from './localStorage';
import { useEffect } from 'react';
import { fetchSocket } from './api/socket';
import { io } from 'socket.io-client';
const inter = Inter({ subsets: ['latin'] });

typeof window !== 'undefined' && saveSelectedOrganizationId('none');

export const metadata: Metadata = {
	title: 'Modern solutions tasks',
	description: 'Modern solutions tasks',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		const socket = io('http:/localhost:3001');
		socket.on('connection', () => {
			console.log('socket connected');
		});
		socket.on('connect_error', () => {
			fetchSocket();
		});
	}, []);
	return (
		<html lang='en'>
			<meta charSet='utf-8'></meta>
			<body className={inter.className}>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
