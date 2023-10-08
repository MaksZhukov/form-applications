import { saveSelectedOrganizationId } from '@/app/localStorage';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';
import TaskIcon from '@/icons/TaskIcon';
import TaskInternalIcon from '@/icons/TaskInternal';
import { usePathname } from 'next/navigation';
import { matchPath } from '@/services/route/route';

const menuItems = [
	{
		route: '/applications',
		routeAliases: ['/applications/new', '/applications/:id'],
		name: 'Задачи',
		icon: TaskIcon
	},
	{
		route: '/applications-internal',
		routeAliases: ['/applications-internal/new', '/applications-internal/:id'],
		name: 'Внутренние задачи',
		icon: TaskInternalIcon
	}
];

export const SideBar = () => {
	const currentRoute = usePathname();
	const handleClickApplications = () => {
		saveSelectedOrganizationId('none');
	};

	return (
		<div className='fixed h-full gap-2 w-24 px-2 py-5 border-r border-gray-300 flex flex-col'>
			{menuItems.map((item) => {
				const Icon = item.icon;
				return (
					<Link key={item.name} href={item.route}>
						<Button
							onClick={handleClickApplications}
							size='sm'
							className={`p-1 w-full h-16 flex text-[10px] flex-col justify-center items-center border-accent text-accent ${
								matchPath(item.route, currentRoute) ||
								item.routeAliases.some((el) => matchPath(el, currentRoute))
									? ''
									: 'border-none'
							}`}
							variant='outlined'>
							<Icon fontSize={24}></Icon>
							{item.name}
						</Button>
					</Link>
				);
			})}
		</div>
	);
};
