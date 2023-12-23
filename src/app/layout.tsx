import { Inter } from 'next/font/google';
import { QueryProvider } from './query';
const inter = Inter({ subsets: ['latin'] });
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Modern Solutions',
	description: 'Modern Solutions'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<meta charSet='utf-8'></meta>
			<body className={inter.className}>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
