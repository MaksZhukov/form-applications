import { saveSelectedOrganizationId } from '@/app/localStorage';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';
import TaskIcon from '@/icons/TaskIcon';
import TaskInternalIcon from '@/icons/TaskInternal';
import { usePathname } from 'next/navigation';

const menuItems = [
	{ route: '/applications', name: 'Задачи' },
	{ route: '/applications-internal', name: 'Внутренние задачи' }
];

export const SideBar = () => {
	const currentRoute = usePathname();
	const handleClickApplications = () => {
		saveSelectedOrganizationId('none');
	};
	console.log(currentRoute);
	return (
		<div className='fixed h-full gap-2 w-24 px-2 py-5 border-r border-gray-300 flex flex-col'>
			{menuItems.map((item) => (
				<Link key={item.name} href={item.route}>
					<Button
						onClick={handleClickApplications}
						size='sm'
						className={`p-1 w-full h-16 flex text-[10px] flex-col justify-center items-center border-accent text-accent ${
							currentRoute === item.route ? '' : 'border-none'
						}`}
						variant='outlined'>
						<TaskIcon fontSize={24}></TaskIcon>
						{item.name}
					</Button>
				</Link>
			))}
		</div>
	);
};
