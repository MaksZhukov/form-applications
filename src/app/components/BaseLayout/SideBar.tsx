import { getLoginTime, saveSelectedOrganizationId } from '@/app/localStorage';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';
import TaskIcon from '@/icons/TaskIcon';
import TaskInternalIcon from '@/icons/TaskInternal';
import { usePathname } from 'next/navigation';
import { matchPath } from '@/services/route/route';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/api/user';
import { UserAttributes } from '@/db/users/types';
import { OrganizationAttributes } from '@/db/organization/types';

const getMenuItems = (user?: UserAttributes & { organization: OrganizationAttributes }) => [
	{
		route: '/applications',
		routeAliases: ['/applications/new', '/applications/:id'],
		name: 'Задачи',
		icon: TaskIcon
	},
	...(user?.role === 'admin' || user?.organization.id === +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID
		? [
				{
					route: '/applications-internal',
					routeAliases: ['/applications-internal/new', '/applications-internal/:id'],
					name: 'Внутренние задачи',
					icon: TaskInternalIcon
				}
		  ]
		: [])
];

export const SideBar = () => {
	const currentRoute = usePathname();
	const handleClickApplications = () => {
		saveSelectedOrganizationId('none');
	};

	const { data: userData } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const menuItems = getMenuItems(userData?.data);

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
