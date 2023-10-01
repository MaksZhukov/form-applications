import { saveSelectedOrganizationId } from '@/app/localStorage';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';
import TaskIcon from '@/icons/TaskIcon';

export const SideBar = () => {
	return (
		<div className='fixed h-full w-20 px-2 py-5 border-r border-gray-300 flex flex-col'>
			<Link href={'/applications'}>
				<Button
					onClick={() => {
						saveSelectedOrganizationId('none');
					}}
					size='sm'
					className='p-1 flex flex-col justify-center items-center border-accent text-accent'
					variant='outlined'>
					<TaskIcon fontSize={30}></TaskIcon>задачи
				</Button>
			</Link>
		</div>
	);
};