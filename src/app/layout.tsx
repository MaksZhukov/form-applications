'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from './query';
import { saveSelectedOrganizationId } from './localStorage';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchSocket } from './api/socket';
const inter = Inter({ subsets: ['latin'] });
import './globals.css';
import { socketService } from './socket';

typeof window !== 'undefined' && saveSelectedOrganizationId('none');

export const metadata: Metadata = {
	title: 'Modern solutions tasks',
	description: 'Modern solutions tasks'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		socketService.init();
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
