import { Inter } from 'next/font/google';
import { QueryProvider } from './query';
import { saveSelectedOrganizationId } from './localStorage';
const inter = Inter({ subsets: ['latin'] });
import './globals.css';

typeof window !== 'undefined' && saveSelectedOrganizationId('none');

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
