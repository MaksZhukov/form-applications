import { fetchUsers } from '@/app/api/users';
import { getLoginTime } from '@/app/localStorage';
import { Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';

interface Props {
	responsibleUserId?: number;
}

const ResponsibleUserSelect: FC<Props> = ({ responsibleUserId }) => {
	const { data } = useQuery({
		queryKey: ['users', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUsers({ organizationId: 0 }),
	});

	return (
		<div className='flex mb-5'>
			<Typography className='w-56'>Ответственный</Typography>{' '}
			<select
				defaultValue={responsibleUserId}
				name='responsibleUserId'
				className='flex-0.5 border border-gray-300 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
			>
				{data?.data.data.map((item) => (
					<option key={item.id} value={item.id}>
						{item.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default ResponsibleUserSelect;
